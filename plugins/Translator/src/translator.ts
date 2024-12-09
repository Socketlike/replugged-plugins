import translator from '@sckt/translate';

import { APIMessage } from 'discord-api-types/v9';

import { lodash as _, i18n } from 'replugged/common';

import { config } from './util';

export const _translate = async (
  text: string,
  self?: boolean,
): Promise<{ text: string; error?: unknown }> => {
  const to =
    (self ? config.get('targetLanguage') : config.get('yourLanguage')) ||
    i18n.intl.currentLocale.split('-')[0];

  const engine = config.get('apiKey') ? 'google_cloud' : 'google_dict_chrome_ex';

  let result: { text: string; error?: unknown } = { text };

  if (!text) result.error = 'message content is empty';
  else {
    const res = await translator(text, {
      engine,
      from: 'auto',
      to,
      key: config.get('apiKey'),
    })
      .then((text) => ({ text }))
      .catch((error) =>
        engine === 'google_cloud'
          ? translator(text, { engine: 'google_dict_chrome_ex', from: 'auto', to })
              .then((text) => ({ text }))
              .catch((error) => ({
                error,
                text,
              }))
          : {
              error,
              text,
            },
      );

    if ('error' in res) result.error = res.error;
    else result.text = res.text;
  }

  return result;
};

export const originalCache = new Map<string, APIMessage>();

export const translate = async (
  message: APIMessage,
): Promise<{ message: APIMessage; text: string; error?: unknown }> => {
  const translatedMessage = _.clone(message);
  const translationResult = await _translate(translatedMessage.content);

  translatedMessage.content = translationResult.text;

  if (!('error' in translationResult)) originalCache.set(translatedMessage.id, _.clone(message));

  return { message: translatedMessage, ...translationResult };
};

export const untranslate = (messageId: string): APIMessage => {
  const untranslatedMessage = originalCache.get(messageId);

  originalCache.delete(messageId);

  return untranslatedMessage;
};

export const untranslateAll = (): APIMessage[] =>
  [...originalCache.keys()].map((id) => untranslate(id));
