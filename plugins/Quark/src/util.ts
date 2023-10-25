import { Logger, settings } from 'replugged';
import type { Quark } from '@quark';

export const _logger = Logger.plugin('Quark');

export const defaultConfig = {
  debugging: false,
  quarks: {} as Record<string, Quark>,
};

export const config = await settings.init('lib.evelyn.Quark', defaultConfig);

export const logger = {
  error: (...args: unknown[]): void =>
    config.get('debugging') ? _logger.error(...args) : undefined,
  log: (...args: unknown[]): void => (config.get('debugging') ? _logger.log(...args) : undefined),
  warn: (...args: unknown[]): void => (config.get('debugging') ? _logger.warn(...args) : undefined),
};
