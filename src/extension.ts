import * as path from 'path';
import { ExtensionContext, commands } from 'vscode';
import { evalCommand, evalMultiCommand } from './evalCommand';
import { setResourcePath } from './resourceReader';

export function activate(context: ExtensionContext) {
  let resourcePath = context.asAbsolutePath(path.join('src', 'resources'));

  setResourcePath(resourcePath);

  let evalCommandRegistered = commands.registerCommand(
    'tcpure.eval',
    evalCommand
  );

  let evalMultiCommandRegistered = commands.registerCommand(
    'tcpure.evalMulti',
    evalMultiCommand
  );

  context.subscriptions.push(evalCommandRegistered);
  context.subscriptions.push(evalMultiCommandRegistered);
}

export function deactivate() {}
