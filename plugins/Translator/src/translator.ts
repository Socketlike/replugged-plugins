import _translate from 'translate';

import { i18n, toast } from 'replugged/common';

import { config } from './Settings';
import { logger } from './util';

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
