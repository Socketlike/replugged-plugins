import { PlaintextPatch } from 'replugged/types';

export default [
  {
    find: 'Messages.SOURCE_MESSAGE_DELETED',
    replacements: [
      {
        match: /,.{1,3}&&null!=(.{1,3})\.editedTimestamp/,
        replace:
          ',(()=>{try{return window.replugged.plugins.getExports("lib.evelyn.Translator").renderTranslatedTag($1)}catch{}})()$&',
      },
    ],
  },
] as PlaintextPatch[];
