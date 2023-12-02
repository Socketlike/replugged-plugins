import { EventEmitter } from '@shared/misc';
import { Logger, settings } from 'replugged';

export const logger = Logger.plugin('Translator');

export const defaultConfig: {
  language: string;
  url: string;
} = {
  language: '',
  url: 'https://lingva.ml',
};

export type DefaultConfig = typeof defaultConfig;

export const config = await settings.init('lib.evelyn.Translator', defaultConfig);

export const events = new EventEmitter<{ languageChanged: string }>();
