# tcpure README

TCPURE is a lightweight, featureless client for TidalCycles. 
Just an editor and _fast_ GHCI REPL output via 
the VS Code terminal. Uses a hard-coded Tidal bootup sequence with no
possibility of customization (yet).

## Features

Just start typing some TidalCycles code, and eval it:

* `Shift+Enter` for a single line eval
* `Ctrl+Enter` for a multi-line eval

This extension's keybindings will conflict with the main TidalCycles
extension, so make sure to disable that extension's keyboard shortcuts
before using this one. 

You do not need to use a file with a `.tidal` extension. You can eval
Tidal code in any type of file.

## Installation

If you want to install from a release, download the binary and then:

``` 
code --install-extension tcpure-1.1.0.vsix
```

Otherwise if you want to install from the source code you will need to use
`vsce` to package it first:

``` 
git clone git@github.com:kindohm/tcpure.git
cd tcpure
vsce package
code --install-extension tcpure-1.1.0.vsix
```
