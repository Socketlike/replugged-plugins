import { types } from 'replugged';

export default [
  {
    find: /"Playback auto paused"/,
    replacements: [
      {
        // auto pause trigger
        match: /function (.{1,3})\(\)\{if\(null==.{1,3}\).+?\.info\("Playback auto paused"\)\}/,
        replace: 'function $1(){}',
      },
      {
        // vc watcher
        match:
          /function (.{1,3})\(.{1,3}\)\{.{1,40}=\w+\.\w+\.isCurrentClientInVoiceChannel\(\).+?return!1}/,
        replace: 'function $1(){return!1}',
      },
      {
        // remove voice state detection
        match: /VOICE_STATE_UPDATES:\w+,/,
        replace: '',
      },
      {
        // remove speaking detection
        match: /SPEAKING:\w+,/,
        replace: '',
      },
    ],
  },
] as types.PlaintextPatch[];
