const { spawn } = require('child_process');
const split2 = require('split2');
const { EOL } = require('os');

let booted: boolean;
let ghciProcess: any;
let stdErr: string[] = [];
let stdOut: string[] = [];
let stdTimer: NodeJS.Timeout;
let logStdOut: boolean;

const startGhci = () => {
  const ghciOptions = ['-XOverloadedStrings'];
  ghciProcess = spawn('ghci', ghciOptions);

  ghciProcess.stderr.pipe(split2()).on('data', (data: any) => {
    logError(data.toString('utf8'));
  });

  ghciProcess.stdout.on('data', (data: any) => {
    log(data.toString('utf8'));
  });
};

const log = (text: string) => {
  stdOut.push(text);
  processStd();
};

const logError = (text: string) => {
  stdErr.push(text);
  processStd();
};

const processStd = () => {
  clearTimeout(stdTimer);
  // defers the handler of stdOut/stdErr data
  // by some arbitrary ammount of time (50ms)
  // to get the buffer filled completly
  stdTimer = setTimeout(() => flushStd(), 50);
};

const flushStd = () => {
  if (stdErr.length) {
    let output = stdErr.join('');
    // .trim()
    // .replace(/<interactive>.*error:/g, "")
    // .replace(/ \(bound at.*/g, "")

    process.stderr.write(output);
    stdErr.length = 0;

    //dont care about stdOut if there are errors
    //stdOut.length = 0
  }

  if (stdOut.length) {
    let output = stdOut.join('');
    // .trim()
    // .replace(/tidal>.*Prelude>/g, "")
    // .replace(/tidal>/g, "")
    // .replace(/Prelude>/g, "")
    // .replace(/Prelude.*\|/g, "")
    // .replace(/GHCi.*help/g, "")

    logStdOut && process.stdout.write(output);
    stdOut.length = 0;
  }
};

function boot(options: any): void {
  if (booted) {
    return;
  }

  logStdOut = options.logStdOut === true;
  log('booting...');
  startGhci();

  for (let i = 0; i < bootCommands.length; i++) {
    ghciProcess.stdin.write(`${bootCommands[i]}${EOL}`);
  }

  booted = true;
}

function evaluate(tidalCode: string): void {
  if (!isBooted()) {
    boot({ logStdOut: true });
  }
  writeBlock(tidalCode);
}

const writeLine = (command: string) => {
  ghciProcess.stdin.write(`${command}${EOL}`);
};

const writeBlock = (block: string) => {
  const parts = block.split(EOL);
  writeLine(':{');
  parts.forEach((part) => {
    writeLine(part);
  });
  writeLine(':}');
};

const isBooted = (): boolean => booted;

const bootCommands = [
  ':set -XOverloadedStrings',
  ':set prompt ""',
  ':set prompt-cont ""',
  'import Sound.Tidal.Context',
  'tidal <- startTidal (superdirtTarget {oLatency = 0.1, oAddress = "127.0.0.1", oPort = 57120}) (defaultConfig {cFrameTimespan = 1/20})',
  ':{',
  'let p = streamReplace tidal',
  '    hush = streamHush tidal',
  '    list = streamList tidal',
  '    mute = streamMute tidal',
  '    unmute = streamUnmute tidal',
  '    solo = streamSolo tidal',
  '    unsolo = streamUnsolo tidal',
  '    once = streamOnce tidal',
  '    asap = once',
  '    nudgeAll = streamNudgeAll tidal',
  '    all = streamAll tidal',
  '    resetCycles = streamResetCycles tidal',
  '    setcps = asap . cps',
  '    xfade i = transition tidal True (Sound.Tidal.Transition.xfadeIn 4) i',
  '    xfadeIn i t = transition tidal True (Sound.Tidal.Transition.xfadeIn t) i',
  '    histpan i t = transition tidal True (Sound.Tidal.Transition.histpan t) i',
  '    wait i t = transition tidal True (Sound.Tidal.Transition.wait t) i',
  '    waitT i f t = transition tidal True (Sound.Tidal.Transition.waitT f t) i',
  '    jump i = transition tidal True (Sound.Tidal.Transition.jump) i',
  '    jumpIn i t = transition tidal True (Sound.Tidal.Transition.jumpIn t) i',
  "    jumpIn' i t = transition tidal True (Sound.Tidal.Transition.jumpIn' t) i",
  '    jumpMod i t = transition tidal True (Sound.Tidal.Transition.jumpMod t) i',
  '    mortal i lifespan release = transition tidal True (Sound.Tidal.Transition.mortal lifespan release) i',
  '    interpolate i = transition tidal True (Sound.Tidal.Transition.interpolate) i',
  '    interpolateIn i t = transition tidal True (Sound.Tidal.Transition.interpolateIn t) i',
  '    clutch i = transition tidal True (Sound.Tidal.Transition.clutch) i',
  '    clutchIn i t = transition tidal True (Sound.Tidal.Transition.clutchIn t) i',
  '    anticipate i = transition tidal True (Sound.Tidal.Transition.anticipate) i',
  '    anticipateIn i t = transition tidal True (Sound.Tidal.Transition.anticipateIn t) i',
  '    forId i t = transition tidal False (Sound.Tidal.Transition.mortalOverlay t) i',
  '    d1 = p 1 . (|< orbit 0)',
  '    d2 = p 2 . (|< orbit 1)',
  '    d3 = p 3 . (|< orbit 2)',
  '    d4 = p 4 . (|< orbit 3)',
  '    d5 = p 5 . (|< orbit 4)',
  '    d6 = p 6 . (|< orbit 5)',
  '    d7 = p 7 . (|< orbit 6)',
  '    d8 = p 8 . (|< orbit 7)',
  '    d9 = p 9 . (|< orbit 8)',
  '    d10 = p 10 . (|< orbit 9)',
  '    d11 = p 11 . (|< orbit 10)',
  '    d12 = p 12 . (|< orbit 11)',
  '    d13 = p 13',
  '    d14 = p 14',
  '    d15 = p 15',
  '    d16 = p 16',
  ':}',
  ':{',
  'let setI = streamSetI tidal',
  '    setF = streamSetF tidal',
  '    setS = streamSetS tidal',
  '    setR = streamSetI tidal',
  '    setB = streamSetB tidal',
  ':}',
  ':set prompt "tidal> "',
];

export { evaluate };
