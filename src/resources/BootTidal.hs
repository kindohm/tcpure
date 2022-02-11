:set -XOverloadedStrings
:set prompt ""

import Sound.Tidal.Context

import System.IO (hSetEncoding, stdout, utf8)
hSetEncoding stdout utf8

-- total latency = oLatency + cFrameTimespan
tidal <- startTidal (superdirtTarget {oLatency = 0.1, oAddress = "127.0.0.1", oPort = 57120}) (defaultConfig {cVerbose = True, cFrameTimespan = 1/20})

let only = (hush >>)
let p = streamReplace tidal
let hush = streamHush tidal
let list = streamList tidal
let mute = streamMute tidal
let unmute = streamUnmute tidal
let unmuteAll = streamUnmuteAll tidal
let unsoloAll = streamUnsoloAll tidal
let solo = streamSolo tidal
let unsolo = streamUnsolo tidal
let once = streamOnce tidal
let first = streamFirst tidal
let asap = once
let nudgeAll = streamNudgeAll tidal
let all = streamAll tidal
let resetCycles = streamResetCycles tidal
let setcps = asap . cps
let getcps = streamGetcps tidal
let getnow = streamGetnow tidal
let d1 = p 1 . (|< orbit 0)
let d2 = p 2 . (|< orbit 1)
let d3 = p 3 . (|< orbit 2)
let d4 = p 4 . (|< orbit 3)
let d5 = p 5 . (|< orbit 4)
let d6 = p 6 . (|< orbit 5)
let d7 = p 7 . (|< orbit 6)
let d8 = p 8 . (|< orbit 7)
let d9 = p 9 . (|< orbit 8)
let d10 = p 10 . (|< orbit 9)
let d11 = p 11 . (|< orbit 10)
let d12 = p 12 . (|< orbit 11)

let getState = streamGet tidal
let setI = streamSetI tidal
let setF = streamSetF tidal
let setS = streamSetS tidal
let setR = streamSetR tidal
let setB = streamSetB tidal

:set prompt "tidal> "
:set prompt-cont ""

default (Pattern String, Integer, Double)
