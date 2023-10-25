import { _logger, config, logger } from '@util';
import { common } from 'replugged';

const { lodash: _ } = common;

type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export interface Quark {
  enabled: boolean;
  start: string;
  stop?: string;
}

export interface QuarkState {
  enabled: ReactState<boolean>;
  name: ReactState<string>;
  start: ReactState<string>;
  stop: ReactState<string | undefined>;
}

export interface QuarkTools {
  logger: (...args: unknown[]) => void;
  storage: Map<string, unknown>;
}

export const quarks = new Map<string, Quark>(Object.entries(config.get('quarks')));
export const storage = new Map<string, Map<string, unknown>>();
export const started = new Set<string>();

export const createQuarkTools = (name: string): QuarkTools => {
  if (quarks.has(name) && !storage.has(name))
    storage.set(name, new Map<string, unknown>([['snippetName', name]]));

  return {
    logger: (...args: unknown[]): void => _logger.log(`(quark "${name}")`, ...args),
    storage: storage.get(name) || new Map<string, unknown>([['snippetName', name]]),
  };
};

export const start = (name: string): void => {
  if (!quarks.has(name))
    logger.log(
      `won't start quark "${name || '<blank name>'}" failed: no such quark with name "${
        name || '<blank name>'
      }"${name in config.get('quarks') && name ? ` (you should try .load("${name}"))` : ''}`,
    );
  else {
    const quark = quarks.get(name);

    if (started.has(name)) logger.log(`won't start quark "${name}": already running`);
    else if (!quark.enabled)
      logger.log(
        `won't start quark "${name}": not enabled${
          'enabled' in quark ? '' : ' (the key "enabled" is missing in quark. try adding it)'
        }`,
      );
    else if (typeof quark.start !== 'string')
      logger.error(`won't start quark "${name}": "start" is not a string`);
    else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        Function('quark', quark.start).call(window, createQuarkTools(name));
        started.add(name);
        _logger.log(`started quark "${name}"`);
      } catch (e) {
        _logger.error(`starting quark "${name}" failed: eval error`, e);
      }
    }
  }
};

export const stop = (name: string): void => {
  if (!quarks.has(name))
    logger.log(
      `won't stop quark "${name || '<blank name>'}": no such quark with name "${
        name || '<blank name>'
      }"${name in config.get('quarks') && name ? ` (you should try load("${name}"))` : ''}`,
    );
  else {
    const quark = quarks.get(name);

    if (!started.has(name)) logger.log(`won't stop quark "${name}": not running`);
    else if (typeof quark.stop !== 'string' && quark.stop)
      logger.error(`won't stop quark "${name}": "stop" is not undefined / string`);
    else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        Function('quark', quark.stop).call(window, createQuarkTools(name));
        _logger.log(`stopped quark "${name}"`);
      } catch (e) {
        _logger.error(`stopping quark "${name}" failed: eval error`, e);
      } finally {
        storage.delete(name);
        started.delete(name);
      }
    }
  }
};

export const startAll = (): void => {
  for (const [name] of quarks) start(name);
};

export const stopAll = (): void => {
  for (const name of started) stop(name);
};

export const load = (name: string): void => {
  const quarksConfig = config.get('quarks');

  if (name in quarksConfig && typeof name === 'string' && name) {
    if (started.has(name)) stop(name);

    quarks.set(name, quarksConfig[name]);

    logger.log(`loaded quark "${name}"`);
  } else
    logger.log(
      `won't load quark "${name || '<blank name>'}"${
        typeof name !== 'string' || !name ? ' (invalid name)' : ''
      }`,
    );
};

export const unload = (name: string): void => {
  if (quarks.has(name)) {
    if (started.has(name)) stop(name);

    quarks.delete(name);

    logger.log(`unloaded quark "${name}"`);
  } else logger.log(`won't unload quark "${name || '<blank name>'}" (not loaded)`);
};

export const loadAll = (): void => {
  const quarksConfig = config.get('quarks');

  for (const [name] of Object.entries(quarksConfig)) load(name);
};

export const unloadAll = (): void => {
  for (const [name] of quarks) unload(name);
};

export const restart = (name: string): void => {
  if (!quarks.has(name))
    logger.log(
      `won't restart quark "${name || '<blank name>'}": no such quark with name "${
        name || '<blank name>'
      }"${name in config.get('quarks') && name ? ' (you should try load("${name}"))' : ''}`,
    );
  else {
    load(name);
    start(name);

    logger.log(`restarted quark "${name}"`);
  }
};

export const add = (name: string, quark: Quark, force?: boolean): void => {
  if (typeof name !== 'string' || !name)
    logger.log(`won't add quark "${name || '<blank name>'}": invalid name`);
  else if (!force && (name in config.get('quarks') || name in [...quarks.keys()]))
    logger.log(`won't add quark "${name}": quark with name "${name}" already exists`);
  else if (typeof quark !== 'object' || !('enabled' in quark) || !('start' in quark))
    logger.log(
      `won't add quark "${name}": invalid quark object${
        !('enabled' in quark) ? ' (missing enabled key)' : ''
      }${!('start' in quark) ? ' (missing start key)' : ''}`,
    );
  else {
    config.set('quarks', { ...config.get('quarks'), [name]: quark });
    load(name);

    logger.log(`added quark "${name}"`);
  }
};

export const remove = (name: string): void => {
  if (typeof name !== 'string' || !name)
    logger.log(`won't remove quark "${name || '<blank name>'}": invalid name`);
  else if (!(name in config.get('quarks')) && !(name in [...quarks.keys()]))
    logger.log(`won't remove quark "${name}": quark with name "${name}" doesn't exist`);
  else {
    config.set(
      'quarks',
      Object.entries(config.get('quarks'))
        .filter(([n]): boolean => n !== name)
        .reduce((acc, [name, quark]): Record<string, Quark> => {
          acc[name] = quark;
          return acc;
        }, {}),
    );
    unload(name);

    logger.log(`removed quark "${name}"`);
  }
};

export const get = (name: string, cached = false): Quark =>
  _.clone(cached ? quarks.get(name) : config.get('quarks')[name]);

export const getAll = (cached = false): Record<string, Quark> => {
  if (cached)
    return [...quarks.entries()]
      .sort(([a], [b]): number => a.localeCompare(b))
      .reduce((acc, [name, quark]): Record<string, Quark> => {
        acc[name] = _.clone(quark);
        return acc;
      }, {});
  else return _.clone(config.get('quarks'));
};

export const toggle = (name: string, state: boolean): void => {
  if (typeof name !== 'string' || !name)
    logger.log(`won't toggle quark "${name || '<blank name>'}": invalid name`);
  else if (!(name in config.get('quarks')) && !(name in [...quarks.keys()]))
    logger.log(`won't toggle quark "${name}": quark with name "${name}" doesn't exist`);
  else {
    const quark = get(name);

    quark.enabled = state;

    add(name, quark, true);

    if (quark.enabled && !started.has(name)) start(name);
  }
};

export const has = (name: string, cached = false): boolean => Boolean(get(name, cached));
