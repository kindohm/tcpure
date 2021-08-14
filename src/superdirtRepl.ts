import { Terminal, Uri, window, workspace } from 'vscode';

let terminal: Terminal;

interface ISuperDirtRepl {}

let instance: ISuperDirtRepl;

function getSuperDirtBootFileUri(): Uri {
  const workspaceFolder = workspace.workspaceFolders[0];
  const folderPath = workspaceFolder.uri.path;
  return Uri.file(`${folderPath}/boot_superdirt.scd`);
}

async function superDirtBootFileExists(): Promise<boolean> {
  try {
    const uri = getSuperDirtBootFileUri();
    console.log('checking for local superdirt boot file', uri.path);
    await workspace.fs.stat(getSuperDirtBootFileUri());
    console.log('local superdirt boot file exists');
    return true;
  } catch (err) {
    console.log('local superdirt boot file does not exist');
    return false;
  }
}

export async function getSuperDirt(): Promise<ISuperDirtRepl> {
  if (!terminal || !instance) {
    const exists = await superDirtBootFileExists();
    if (!exists) {
      instance = {};
      return instance;
    }

    console.log('using local superdirt boot file');
    terminal = window.createTerminal({
      name: 'superdirt',
    });

    terminal.show();
    const bootUri = getSuperDirtBootFileUri();
    writeLine(`sclang ${bootUri.path}`);

    instance = {};
    return instance;
  } else {
    return instance;
  }
}

const writeLine = (line: string) => {
  terminal.sendText(`${line}`);
};
