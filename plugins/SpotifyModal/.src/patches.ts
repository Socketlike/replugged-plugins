import { PlaintextPatch } from 'replugged/types';

export default [
  {
    find: 'hidePrivateData:',
    replacements: [
      {
        match: /\(0,\w+\.\w+\)\("div",{className:\w+\.container/,
        replace:
          '(()=>{try{return window.replugged.plugins.getExports("lib.evelyn.SpotifyModal").renderModal()}catch{}})(),$&',
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
