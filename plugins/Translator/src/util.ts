import { EventEmitter } from '@shared/misc';
import { Logger, settings } from 'replugged';

export const logger = Logger.plugin('Translator');

export const defaultConfig: {
  sendTranslateEnabled: boolean;
  targetLanguage: string;
  url: string;
  yourLanguage: string;
} = {
  sendTranslateEnabled: false,
  targetLanguage: '',
  url: 'https://lingva.ml',
  yourLanguage: '',
};

export type DefaultConfig = typeof defaultConfig;

export const config = await settings.init('lib.evelyn.Translator', defaultConfig);

export const events = new EventEmitter<{ languageChanged: string }>();
