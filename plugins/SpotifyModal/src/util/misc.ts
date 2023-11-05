import { Injector, Logger, webpack } from 'replugged';

import { DefaultConfigKeys, config } from '../config';

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

  const dateObject = new Date(ms);
  const raw = {
    month: dateObject.getUTCMonth(),
    day: dateObject.getUTCDate(),
    hours: dateObject.getUTCHours(),
    minutes: dateObject.getUTCMinutes(),
    seconds: dateObject.getUTCSeconds(),
  };
  const parsedHours = raw.hours + (raw.day - 1) * 24 + raw.month * 30 * 24;

  return `${parsedHours > 0 ? `${parsedHours}:` : ''}${
    raw.minutes < 10 && parsedHours > 0 ? `0${raw.minutes}` : raw.minutes
  }:${raw.seconds < 10 ? `0${raw.seconds}` : raw.seconds}`;
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

export const useTrappedSettingsState = <T extends DefaultConfigKeys, D>(
  useSettingRes: { value: D; onChange: (newValue: D) => void },
  key: T,
  trap: (key: T, newValue: D) => void,
): { value: D; onChange: (newValue: D) => void } => ({
  value: useSettingRes.value,
  onChange: (newValue): void => {
    trap(key, newValue);
    useSettingRes.onChange(newValue);
  },
});

export const containerClasses = await webpack.waitForModule<{
  container: string;
}>(webpack.filters.byProps('container', 'godlike'));
