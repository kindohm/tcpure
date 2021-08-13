# tcpure README

TCPURE is a lightweight and (nearly) featureless client for TidalCycles
with two goals in mind:

- Just an editor with no bells or whistles
- _fast_ GHCI REPL output via the VS Code terminal (much like vim-tidal)

The extension uses a hard-coded Tidal bootup sequence with
extremely limited possibility of customization.

## Features

Just start typing some TidalCycles code in any file and eval it:

- `Shift+Enter` for a single line eval
- `Ctrl+Enter` for a multi-line eval

Flash/feedback color is configurable:

```
{
  "tcpure.flashDecoration": "#ff0000"
}
```

Tidal's calc window size and latency are also configurable:

```
{
  "tcpure.calcWindow": 0.05,
  "tcpure.latency": 0.02
}
```

**This extension's keybindings will conflict with the main TidalCycles
extension**, so make sure to uninstall that extension, or disable its
keyboard shortcuts before using this one.

You do not need to use a file with a `.tidal` extension. You can eval
Tidal code in any type of file.

## Installation from Binaries

If you want to install from a release, download the binary and then:

```
code --install-extension tcpure-1.1.3.vsix
```

## Build and install from source

Otherwise if you want to install from the source code you will need to use
`vsce` to package it first:

```
git clone git@github.com:kindohm/tcpure.git
cd tcpure
vsce package
code --install-extension tcpure-1.1.3.vsix
```

## Custom Bootup

If you really, _really_ want to use a custom Tidal bootup, then you will need
to modify the source code. Modify the `bootCommands.ts` file however
you like, then follow the "Build and install from source" instructions above.

## Syntax Highlighting

In order to get syntax highlighting in .tidal files you must do two things:

1. Install the [Haskell Syntax Highlighting](https://marketplace.visualstudio.com/items?itemName=justusadam.language-haskell) extension
2. Associate .tidal files to the Haskell language by adding the following settings in `settings.json`:

```
"files.associations": {
    "*.tidal": "haskell"
}
```

## Contributing

The purpose of this extension is to provide a clean, minimal Tidal
environment that is _fast_ in VS Code. Anything beyond minimal, default
Tidal behavior will not be accepted in pull requests.

Feel free to submit a pull request for:

- bug fixes
- missing _default_ behaviors that you would normally find in [BootTidal.hs](https://github.com/tidalcycles/Tidal/blob/main/BootTidal.hs).
- aesthetic enhancements that possibly improve the appearance during a live performance
