import _translate from 'translate';

import { APIMessage } from 'discord-api-types/v9';

import { lodash as _, i18n } from 'replugged/common';

import { config } from './util';

export const translatedMessages = new Map<
  string,
  { original: string; translated: string; message: APIMessage }
>();

export const translate = async (
  text: string,
  engine = config.get('engine'),
): Promise<{ text: string; error?: unknown }> => {
  const key = config.get('apiKeys')[engine] || '';
  const to = config.get('language') || i18n.getLocale()?.split?.('-')?.[0] || 'en';

  let result: { text: string; error?: unknown } = { text };

  if (!text) result.error = 'message content is empty';
  else if (['deepl', 'yandex'].includes(engine) && !key)
    result.error = `missing API key for engine "${engine}"`;
  else {
    const res = await _translate(text, { engine, key, to })
      .then((translatedText) => ({ text: translatedText }))
      .catch((error) => ({ text, error }));

    if ('error' in res) result.error = res.error;
    else result.text = res.text;
  }

  return result;
};

export const translateMessage = async (
  message: APIMessage,
  engine = config.get('engine'),
): Promise<{ message: APIMessage; text: string; error?: unknown }> => {
  const translatedMessage = _.clone(message);
  const translationResult =
    translatedMessages.has(translatedMessage.id) &&
    translatedMessage.content === translatedMessages.get(translatedMessage.id).original &&
    translatedMessage.content === translatedMessages.get(translatedMessage.id).translated
      ? { text: translatedMessages.get(translatedMessage.id).translated }
      : await translate(translatedMessage.content, engine);

  translatedMessage.content = translationResult.text;

  if (!('error' in translationResult))
    translatedMessages.set(translatedMessage.id, {
      message: _.clone(message),
      original: message.content,
      translated: translatedMessage.content,
    });

  return { message: translatedMessage, ...translationResult };
};

export const untranslateMessage = (message: APIMessage): APIMessage => {
  const untranslatedMessage = _.clone(message);

  if (translatedMessages.has(message.id)) {
    untranslatedMessage.content = translatedMessages.get(message.id).original;
    translatedMessages.delete(message.id);
  }

  return untranslatedMessage;
};

export const untranslateAllMessages = (): APIMessage[] => {
  return [...translatedMessages.values()].map(({ message }) => untranslateMessage(message));
};

export const translatedMessageExists = (messageId: string): boolean =>
  translatedMessages.has(messageId);
