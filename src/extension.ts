import { ExtensionContext, commands } from 'vscode';
import { evalCommand, evalMultiCommand } from './evalCommand';

export function activate(context: ExtensionContext) {
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
