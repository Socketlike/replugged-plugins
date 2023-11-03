import { types } from 'replugged';

const patches: types.PlaintextPatch[] = [
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
        match: /handleMessage\((.+?)\)\{/,
        replace:
          '$&window?.replugged?.plugins?.getExports?.("lib.evelyn.SpotifyModal")?.emitMessage?.($1, this);',
      },
      {
        match: /hasConnectedAccount\(\)\{[^}]+?Object\.keys\((.+?)\)\.length/,
        replace: 'spotifyModalAccounts=$1;$&',
      },
    ],
  },
];

export default patches;
