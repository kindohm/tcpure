import { ExtensionContext, commands } from 'vscode';
import evalCommand from './evalCommand';

export function activate(context: ExtensionContext) {
  let evalCommandRegistered = commands.registerCommand(
    'tcpure.eval',
    evalCommand
  );

  context.subscriptions.push(evalCommandRegistered);
}

export function deactivate() {}
