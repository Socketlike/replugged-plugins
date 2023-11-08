import { PlaintextPatch } from 'replugged/types';

export default [
  {
    /* https://github.com/Vendicated/Vencord/blob/main/src/plugins/spotifyControls/index.tsx#L49-L57 */
    find: 'showTaglessAccountPanel:',
    replacements: [
      {
        match: /return?\s?(.{0,30}\(.{1,3},\{[^}]+?,showTaglessAccountPanel:.+?\}\))/s,
        replace:
          'return [window.replugged.plugins.getExports("lib.evelyn.SpotifyModal")?.renderModal?.(),$1]',
      },
    ],
  },
  {
    find: 'dealer.spotify.com',
    replacements: [
      {
        match: /handleEvent\((.{1,3})\)\{/,
        replace:
          '$&window?.replugged?.plugins?.getExports?.("lib.evelyn.SpotifyModal")?.emitEvent?.($1, this);',
      },
    ],
  },
] as PlaintextPatch[];
