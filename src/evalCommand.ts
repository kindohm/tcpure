import { Range, TextEditor, TextDocument, window } from 'vscode';
import { getRepl } from './repl';
import { EOL } from 'os';

export default function command() {
  const input = getExpressionUnderCursor(true);
  if (!input) {
    return;
  }
  const repl = getRepl((r: any) => {
    r.send(input);
  });
  // repl.send(input);

  // const splits = input.split(EOL);
  // // if (splits.length === 1) {
  // //   repl.send(input);
  // // } else {
  // //   repl.send('{');
  // //   repl.send(input);
  // //   repl.send('}');
  // // }
}

function getExpressionUnderCursor(getMultiline: boolean): string | null {
  const editor: TextEditor | undefined = window.activeTextEditor;

  if (!editor) {
    return null;
  }

  const document = editor.document;
  const selectedRange = new Range(
    editor.selection.anchor,
    editor.selection.active
  );
  const startLineNumber = getStartLineNumber(document, selectedRange);
  if (startLineNumber === null) {
    return null;
  }

  const endLineNumber = getEndLineNumber(document, startLineNumber);
  const endCol = document.lineAt(endLineNumber).text.length;

  let range = new Range(startLineNumber, 0, endLineNumber, endCol);

  // bad place for this
  feedback(range);
  return document.getText(range);
}

function getStartLineNumber(
  document: TextDocument,
  range: Range
): number | null {
  // If current line is empty, search forward for the expression start
  if (isEmpty(document, range.start.line)) {
    return getFirstNonBlankLineInRange(document, range);
  }

  // Else, current line has contents and so Tidal expression may start on a prior line
  return getFirstExpressionLineBeforeSelection(document, range);
}

function getFirstNonBlankLineInRange(
  document: TextDocument,
  range: Range
): number | null {
  for (
    let currentLineNumber = range.start.line;
    currentLineNumber <= range.end.line;
    currentLineNumber++
  ) {
    if (!isEmpty(document, currentLineNumber)) {
      return currentLineNumber;
    }
  }

  return null;
}

function getFirstExpressionLineBeforeSelection(
  document: TextDocument,
  range: Range
): number | null {
  let currentLineNumber = range.start.line;

  // If current line is empty, do not attempt to search.
  if (isEmpty(document, currentLineNumber)) {
    return null;
  }

  while (currentLineNumber >= 0 && !isEmpty(document, currentLineNumber)) {
    currentLineNumber--;
  }

  return currentLineNumber + 1;
}

function getEndLineNumber(
  document: TextDocument,
  startLineNumber: number
): number {
  let currentLineNumber = startLineNumber;
  while (
    currentLineNumber < document.lineCount &&
    !isEmpty(document, currentLineNumber)
  ) {
    currentLineNumber++;
  }
  return currentLineNumber - 1;
}

function isEmpty(document: TextDocument, line: number): boolean {
  return document.lineAt(line).text.trim().length === 0;
}

function feedback(range: Range): void {
  const flashDecorationType = window.createTextEditorDecorationType({
    backgroundColor: '#00ff00',
  });

  const editor: TextEditor | undefined = window.activeTextEditor;

  if (!editor) {
    return;
  }

  editor.setDecorations(flashDecorationType, [range]);
  setTimeout(function () {
    flashDecorationType.dispose();
  }, 250);
}
