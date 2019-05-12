import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as stream from 'stream';
import * as ts from 'typescript';

const compileOpts: ts.TranspileOptions = {
  compilerOptions: {
    strict: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    sourceMap: false,
  }
};

const libPath = path.join(__dirname, 'src/lib/tetris-engine');
const enginePath = path.join(libPath, 'engine.ts');
const piecesPath = path.join(libPath, 'game-pieces.ts');
const typesPath = path.join(libPath, 'types.ts');

const engineContent = readFileSync(enginePath, { encoding: 'utf-8' });
const piecesContent = readFileSync(piecesPath, { encoding: 'utf-8' });
const typesContent = readFileSync(typesPath, { encoding: 'utf-8' });

const outPath = path.join(__dirname, 'dist/webtris/worker.js');

// Reads file content line by line and removes export statements,
// requires, and modifies imported module references.
function modifyModuleOutput(fileContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let modifiedContent = '';
    var buf = Buffer.from(fileContent);
    var bufferStream = new stream.PassThrough();
    bufferStream.end(buf);
    const readStream = readline.createInterface({
      input: bufferStream
    });

    readStream.on('line', (line) => {
      if (line.startsWith('\"use strict\"')) { return; }
      if (line.startsWith('Object.defineProperty')) { return; }
      if (line.includes('require')) { return; }

      line = line.replace(/(var\sTetrisEngineAction);/, '$1 = {};')
      line = line.replace(/TetrisEngineAction\s\=\sexports\.TetrisEngineAction\s\|\|\s\(exports\.TetrisEngineAction\s\=\s\{\}\)/, 'TetrisEngineAction');
      line = line.replace(/game\_pieces\_1\./g, '')
      line = line.replace(/exports\./g, 'const ');
      // Omit module exports:
      // After above replacements it will look something like:
      // const TetrisThing = TetrisThing;
      if (/const\s(\w+)\s\=\s\1/g.test(line)) { return; }
      modifiedContent += '\n' + line;
    });

    readStream.on('close', () => resolve(modifiedContent));
    readStream.on('SIGINT', reject)
  });
}

async function getWorkerContent() {
  try {
    const engineOutput = ts.transpileModule(engineContent, compileOpts);
    const piecesOutput = ts.transpileModule(piecesContent, compileOpts);
    const typesOutput = ts.transpileModule(typesContent, compileOpts);
    const modifiedEngineContent = await modifyModuleOutput(
      engineOutput.outputText
    );
    const modifiedPiecesContent = await modifyModuleOutput(
      piecesOutput.outputText
    );
    const modifiedTypesContent = await modifyModuleOutput(
      typesOutput.outputText
    );
    const modifiedModuleContent = (
      modifiedTypesContent +
      modifiedPiecesContent +
      modifiedEngineContent
    );
    return `
onmessage = (function() {
  "use strict"
  ${modifiedModuleContent}
  function postNewState(state) {
    postMessage(state);
  }
  let tetrisEngine = new TetrisEngine({
    onBoardUpdate: postNewState,
    level: 0
  });
  return (event) => {
    const command = Array.isArray(event.data) ? event.data[0] : event.data;
    switch (command) {
      case TetrisEngineAction.Play:
        return tetrisEngine.play();
      case TetrisEngineAction.PlayAgain:
        return tetrisEngine = (
          TetrisEngine.PlayAgain(postNewState, event.data[1])
        );
      case TetrisEngineAction.TogglePause:
        return tetrisEngine.togglePause();
      case TetrisEngineAction.SetLevel:
        return tetrisEngine.setLevel(event.data[1]);
      case TetrisEngineAction.MoveDown:
        return tetrisEngine.moveDown();
      case TetrisEngineAction.MoveLeft:
        return tetrisEngine.moveLeft();
      case TetrisEngineAction.MoveRight:
        return tetrisEngine.moveRight();
      case TetrisEngineAction.RotateLeft:
        return tetrisEngine.rotateLeft();
      case TetrisEngineAction.RotateRight:
        return tetrisEngine.rotateRight();
    }
  }
})();`;
  } catch (e) {
    console.error(e.message);
  }
}

async function getCreateWorkerFunctionContent() {
  const workerContent = await getWorkerContent();
  return `
  export const createTetrisWorker = (): Worker => {
    const workerBlob = new Blob([\`${workerContent}\`], { type: 'text/javascript' });
    return new Worker(window.URL.createObjectURL(workerBlob));
  }
  `;
}

async function generateWorkerHelper() {
  const createWorkerFunction = await getCreateWorkerFunctionContent();
  const fullOutput = ts.transpileModule(createWorkerFunction, compileOpts);
  return fullOutput.outputText;
}

generateWorkerHelper()
  .then((workerContent) => {
    writeFileSync(outPath, workerContent, { encoding: 'utf-8' });
  })
  .catch(console.error);
