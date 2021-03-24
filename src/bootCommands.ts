import { workspace } from 'vscode';

const configuration = workspace.getConfiguration('tcpure');
const calcWindow = configuration.get<number>('calcWindow', 0.05);
const latency = configuration.get<number>('latency', 0.02);

const bootCommands = [
  ':set -XOverloadedStrings',
  ':set prompt ""',
  ':set prompt-cont ""',
  'import Sound.Tidal.Context',
  `tidal <- startTidal (superdirtTarget {oLatency = ${latency}, oAddress = "127.0.0.1", oPort = 57120}) (defaultConfig {cFrameTimespan = ${calcWindow}})`,
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
  '    mortal i lifespan release = transition tidal True (Sound.Tidal.Transition.mortal lifespan release) i',
  '    d1 = p 1 . (|< orbit 0)',
  '    d2 = p 2 . (|< orbit 1)',
  '    d3 = p 3 . (|< orbit 2)',
  '    d4 = p 4 . (|< orbit 3)',
  '    d5 = p 5 . (|< orbit 4)',
  '    d6 = p 6 . (|< orbit 5)',
  '    d7 = p 7 . (|< orbit 6)',
  '    d8 = p 8 . (|< orbit 7)',
  '    d9 = p 9 . (|< orbit 8)',
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

export { bootCommands };
