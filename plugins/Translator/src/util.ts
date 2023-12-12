import { EventEmitter } from '@shared/misc';
import { Logger, settings } from 'replugged';

export const logger = Logger.plugin('Translator');

export const defaultConfig: {
  sendTranslateEnabled: boolean;
  targetLanguage: string;
  yourLanguage: string;
  apiKey: string;
} = {
  sendTranslateEnabled: false,
  targetLanguage: '',
  yourLanguage: '',
  apiKey: '',
};

export type DefaultConfig = typeof defaultConfig;

export const config = await settings.init('lib.evelyn.Translator', defaultConfig);

export const events = new EventEmitter<{ languageChanged: string }>();
