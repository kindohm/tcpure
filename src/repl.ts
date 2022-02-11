import { Terminal, window } from 'vscode';
import { readBootTidal } from './resourceReader';

let terminal: Terminal;

interface IRepl {
  send(input: string): void;
}

let instance: IRepl;

export function getRepl(): Promise<IRepl> {
  return new Promise((resolve, reject) => {
    if (!terminal || !instance) {
      terminal = window.createTerminal({
        name: 'tcpure',
      });

      const rawBootTidal = readBootTidal();
      const bootCommands = rawBootTidal.split('\n');

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

        resolve(instance);
        // cb(instance);
      }, 1000);
    } else {
      resolve(instance);
      // cb(instance);
    }
  });
}

const writeLine = (line: string) => {
  terminal.sendText(`${line}`);
};

const send = (block: string) => {
  writeLine(':{');
  writeLine(block);
  writeLine(':}');
};
