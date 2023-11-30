import { Logger, settings } from 'replugged';

export const logger = Logger.plugin('Translator');

export const defaultConfig: {
  apiKeys: {
    deepl: string;
    yandex: string;
    google?: never;
    libre?: never;
  };
  engine: 'google' | 'deepl' | 'libre' | 'yandex';
  language: string;
  urlLibreTranslate: string;
} = {
  apiKeys: {
    deepl: '',
    yandex: '',
  },
  engine: 'google',
  language: '',
  urlLibreTranslate: '',
};

export type DefaultConfig = typeof defaultConfig;

export const config = await settings.init('lib.evelyn.Translator', defaultConfig);
