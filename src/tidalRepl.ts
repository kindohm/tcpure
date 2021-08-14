import { Terminal, Uri, window, workspace } from 'vscode';
import { bootCommands } from './bootCommands';
const { EOL } = require('os');
import { getSuperDirt } from './superdirtRepl';

let terminal: Terminal;

interface IRepl {
  send(input: string): void;
}

let instance: IRepl;

function getTidalBootFileUri(): Uri {
  const workspaceFolder = workspace.workspaceFolders[0];
  const folderPath = workspaceFolder.uri.path;
  return Uri.file(`${folderPath}/boot_tidal.tidal`);
}

async function tidalBootFileExists(): Promise<boolean> {
  try {
    const uri = getTidalBootFileUri();
    console.log('checking for local tidal boot file', uri.path);
    await workspace.fs.stat(uri);
    console.log('local tidal boot file exists');
    return true;
  } catch (err) {
    console.log('local tidal boot file does not exist');
    return false;
  }
}

async function getBootFileCommands(): Promise<string[]> {
  const bootFileUri = getTidalBootFileUri();
  const doc = await workspace.openTextDocument(bootFileUri);
  const text = doc.getText();
  const lines = text.split(EOL);
  return lines;
}

async function getTidalBootCommands(): Promise<string[]> {
  const exists = await tidalBootFileExists();
  console.log('custom tidal boot file exists:', exists);
  return exists ? await getBootFileCommands() : bootCommands;
}

async function runTidalBootCommands(): Promise<void> {
  return new Promise((resolve, reject) => {
    getTidalBootCommands().then((commands) => {
      console.log('commands length', commands.length);
      setTimeout(() => {
        for (let i = 0; i < commands.length; i++) {
          writeLine(commands[i]);
        }
        resolve();
      }, 1000);
    });
  });
}

export async function getRepl(): Promise<IRepl> {
  if (!terminal || !instance) {
    await getSuperDirt();

    terminal = window.createTerminal({
      name: 'tcpure',
    });

    terminal.show();
    writeLine('ghci -XOverloadedStrings');
    await runTidalBootCommands();
    window.activeTextEditor?.show();
    instance = { send };
    return instance;

    // setTimeout(() => {
    //   for (let i = 0; i < bootCommands.length; i++) {
    //     writeLine(bootCommands[i]);
    //   }

    //   window.activeTextEditor?.show();

    //   instance = {
    //     send,
    //   };

    //   return instance;
    //   // cb(instance);
    // }, 1000);
  } else {
    return instance;
    // cb(instance);
  }
}

const writeLine = (line: string) => {
  terminal.sendText(`${line}`);
};

const send = (block: string) => {
  const parts = block.split(EOL);
  // terminal.show();
  writeLine(':{');
  writeLine(block);
  writeLine(':}');
};
