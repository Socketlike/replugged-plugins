import { PlaintextPatch } from 'replugged/types';

export default [
  {
    find: 'hidePrivateData:',
    replacements: [
      {
        match: /children:(\(.{75,100}idePrivateData:.+?isEligibleForPomelo:\w+}\))/,
        replace:
          'children:[(()=>{try{return window.replugged.plugins.getExports("lib.evelyn.SpotifyModal").renderModal()}catch{}})(),$1]',
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
