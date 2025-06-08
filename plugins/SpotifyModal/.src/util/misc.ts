import { Injector, Logger, webpack } from 'replugged';

import { config } from '../config';

export const injector = new Injector();

const _logger = Logger.plugin('SpotifyModal', '#1DB954');

export const logger = {
  log: (...args: unknown[]): void => {
    if (config.get('debugging')) _logger.log(...args);
  },

  warn: (...args: unknown[]): void => {
    if (config.get('debugging')) _logger.warn(...args);
  },

  error: (...args: unknown[]): void => {
    if (config.get('debugging')) _logger.error(...args);
  },

  _: _logger,
};

export const parseTime = (ms: number): string => {
  if (typeof ms !== 'number') return '';

  let s = Math.floor(ms / 1000),
    m = Math.floor(s / 60),
    h = Math.floor(m / 60);

  s -= m * 60;
  m -= h * 60;

  return [h > 0 && String(h), String(m).padStart(h > 0 ? 2 : 1, '0'), String(s).padStart(2, '0')]
    .filter(Boolean)
    .join(':');
};

export const handleOverflow = (element: HTMLElement): void => {
  if (element.scrollWidth > element.offsetWidth + 10) {
    element.style.setProperty(
      '--scroll-space',
      `-${(element.scrollWidth - element.offsetWidth).toString()}px`,
    );

    element.style.setProperty(
      '--animation-duration',
      `${((element.scrollWidth - element.offsetWidth) * 50).toString()}ms`,
    );

    if (!element.classList.contains('overflow')) element.classList.add('overflow');
  } else if (element.classList.contains('overflow')) element.classList.remove('overflow');
};

export let containerClasses: {
  container: string;
};

export const initMisc = async (): Promise<void> => {
  containerClasses = await webpack.waitForModule<{
    container: string;
  }>(webpack.filters.byProps('container', 'nameTag'));
};
