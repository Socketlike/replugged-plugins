import { Logger, types } from 'replugged';

const logger = Logger.plugin('NoSpotifyPause');

export default [
  {
    find: /"Playback auto paused"/,
    replacements: [
      {
        // auto pause trigger
        match: /function (.{1,3})\(\)\{[^}]+?\.SPOTIFY_AUTO_PAUSED.+?\}+/,
        replace: 'function $1(){}',
      },
      {
        // vc watcher
        match: /function (.{1,3})\([^}]+?\)\{[^}]+?\.isCurrentClientInVoiceChannel.+?return!1\}/,
        replace: 'function $1(){return !1}',
      },
      {
        // remove voice state detection
        match: /VOICE_STATE_UPDATES:function\(.+?\)\{.+?\},/,
        replace: '',
      },
      {
        // remove speaking detection
        match: /SPEAKING:function\(.+?\)\{.+?\},/,
        replace: '',
      },
    ],
  },
] as types.PlaintextPatch[];
