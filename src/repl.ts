import { Terminal, window } from 'vscode';
// import { corePath } from './settings';
// import { evaluate } from './tidal';
import { bootCommands } from './bootCommands';
const { EOL } = require('os');

let extensionPath: string;
let terminal: Terminal;

interface IRepl {
  send(input: string): void;
}

let instance: IRepl;

export function setExtensionPath(path: string) {
  extensionPath = path;
}

export function getRepl(cb: Function): void {
  if (!terminal || !instance) {
    terminal = window.createTerminal({
      name: 'tcpure',
    });

    terminal.show();
    writeLine('ghci -XOverloadedStrings');

    setTimeout(() => {
      for (let i = 0; i < bootCommands.length; i++) {
        writeLine(bootCommands[i]);
      }

      window.activeTextEditor?.show();

      instance = {
        send,
      };

      cb(instance);
    }, 1000);
  } else {
    cb(instance);
  }
}

const writeLine = (line: string) => {
  terminal.sendText(`${line}`);
};

const send = (block: string) => {
  const parts = block.split(EOL);
  writeLine(':{');
  writeLine(block);
  // parts.forEach((part) => {
  //   writeLine(part);
  // });
  writeLine(':}');
};
