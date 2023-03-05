import { Terminal, window, workspace } from 'vscode';
import { readBootTidal } from './resourceReader';
import { bootSuperDirt } from './superdirt/superdirt';

let terminal: Terminal;

interface IRepl {
  send(input: string): void;
}

let instance: IRepl;

export function getRepl(): Promise<IRepl> {
  return new Promise(async (resolve, reject) => {
    const configuration = workspace.getConfiguration('tcpure');
    const bootSc = configuration.get<boolean>('bootSc');

    if (bootSc){
      await bootSuperDirt();
    }

    if (!terminal || !instance) {
      terminal = window.createTerminal({
        name: 'tcpure',
      });

      const rawBootTidal = readBootTidal();
      const bootCommands = rawBootTidal.split('\n');

      terminal.show();
      await writeLineWait('ghci -XOverloadedStrings', 3000);

      setTimeout(async () => {
        for (let i = 0; i < bootCommands.length; i++) {
          await writeLine(bootCommands[i]);
        }

        window.activeTextEditor?.show();

        instance = {
          send,
        };

        resolve(instance);
        // cb(instance);
      }, 2000);
    } else {
      resolve(instance);
      // cb(instance);
    }
  });
}

const writeLineWait = async (
  line: string,
  time: number = 100
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      terminal.sendText(`${line}`);
      resolve();
    }, time);
  });
};

const writeLine = (line: string) => {
  terminal.sendText(`${line}`);
};

const send = (block: string) => {
  writeLine(':{');
  writeLine(block);
  writeLine(':}');
};
