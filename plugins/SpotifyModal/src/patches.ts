import { PlaintextPatch } from 'replugged/types';

export default [
  {
    /* https://github.com/Vendicated/Vencord/blob/main/src/plugins/spotifyControls/index.tsx#L49-L57 */
    find: 'hidePrivateData:',
    replacements: [
      {
        match: /return\s?(.+?,)?(\(0,.{1,3}\.jsx\)\(.{1,3},\{[^}]+?,hidePrivateData:.+?\}\))/s,
        replace:
          'return $1[(()=>{try{return window.replugged.plugins.getExports("lib.evelyn.SpotifyModal").renderModal()}catch{}})(),$2]',
      },
    ],
  },
  {
    find: 'dealer.spotify.com',
    replacements: [
      {
        match: /handleEvent\((.{1,3})\)\{/,
        replace:
          '$&try{window.replugged.plugins.getExports("lib.evelyn.SpotifyModal").emitEvent($1, this)}catch{}',
      },
    ],
  },
] as PlaintextPatch[];
