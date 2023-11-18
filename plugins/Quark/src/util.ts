import { Logger, settings } from 'replugged';

export const defaultConfig = {
  debugging: false,
};

export const config = await settings.init('lib.evelyn.Quark', defaultConfig);

export const logger = {
  log: (...args: unknown[]): void => config.get('debugging') && logger._.log(...args),
  warn: (...args: unknown[]): void => config.get('debugging') && logger._.warn(...args),
  error: (...args: unknown[]): void => config.get('debugging') && logger._.error(...args),

  _log: (...args: unknown[]): void => !config.get('debugging') && logger._.log(...args),
  _warn: (...args: unknown[]): void => !config.get('debugging') && logger._.warn(...args),
  _error: (...args: unknown[]): void => !config.get('debugging') && logger._.error(...args),

  _: Logger.plugin('Quark'),
};
