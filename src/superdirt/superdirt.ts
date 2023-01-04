import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as split2 from "split2";
import { window, workspace } from 'vscode';

const sclang = `/Applications/SuperCollider.app/Contents/MacOS/sclang`;

let sclangProcess: ChildProcessWithoutNullStreams;
let booted = false;

const detect = 'SuperDirt: listening to Tidal on port 57120';

const outputChannel = window.createOutputChannel("superdirt");
outputChannel.show();

export const kill = () => {
  if (sclangProcess) {
    console.log('killing it');
    sclangProcess.kill();
  }
};

export const bootSuperDirt = (): Promise<void> => {

  return new Promise((resolve, reject) => {

    try {

      if (booted) {
        return resolve();
      }

      outputChannel.appendLine('booting superdirt...');

      const configuration = workspace.getConfiguration('tcpure');
      const startupFilePath = configuration.get<string>('scStartupPath');
      outputChannel.appendLine(`startupFilePath: ${startupFilePath}`);

      // const startupFilePath = "/Users/kindohm/test.scd";

      const spawnOptions = [startupFilePath];
      sclangProcess = spawn(sclang, spawnOptions);

      sclangProcess.stderr.pipe(split2()).on("data", (data: any) => {
        outputChannel.appendLine(data.toString('utf8'));
      });

      sclangProcess.stdout.on("data", (data: any) => {
        const txt = data.toString("utf8");
        outputChannel.append(txt);
        const found = txt.indexOf(detect) !== -1;
        if (found) {
          outputChannel.appendLine('☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️');
          outputChannel.appendLine('☢️☢️☢️ superdirt booted ☢️☢️☢️');
          outputChannel.appendLine('☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️☢️');
          booted = true;
          resolve();
        }
      });

    } catch (err) {
      reject(err);
    }

  });

};