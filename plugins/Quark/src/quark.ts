import React from 'react';

import { lodash as _ } from 'replugged/common';
import * as idb from 'idb-keyval';

import { EventEmitter } from '@shared/misc';

import { logger } from './util';
import { Quark } from './types';

export const store = idb.createStore('quark-replugged', 'quarks');

export const events = new EventEmitter<{ set: string; del: string; start: string; stop: string }>();

export const runningQuarks = new Map<string, () => void>();
export const loadedQuarks = new Map<string, Quark>(await idb.entries(store));

/** @internal */
export const _start = (name: string, quark: Quark): boolean => {
  if (!quark) return;

  /*
    note for future contributors / forkers:

    - do not do the things i did below. (new Function(...))
    -> it is better to just do:
      ```js
      const exports = await import(
        URL.createObjectURL(
          // script: string
          new Blob([script], { type: 'text/javascript' }),
        )
      );
      ```
      then get the start and stop functions from the exports.
      this also allows scripts to have top level await.
  */

  /* eslint-disable @typescript-eslint/no-implied-eval, no-new-func */
  const start = new Function('quark', quark.start || '') as () => void;
  const stop = new Function('quark', quark.stop || '') as () => void;
  /* eslint-enable @typescript-eslint/no-implied-eval, no-new-func */

  logger.log(`[${name}], start`);

  try {
    start();
    runningQuarks.set(name, stop);

    logger.log(`[${name}], start, ok`);
    logger._log(`started "${name}"`);

    events.emit('start', name);

    return true;
  } catch (error) {
    logger.error(`[${name}], start, error:`, error);
    logger._error(`failed starting "${name}"`);

    return false;
  }
};
/** @internal */
export const _stop = (name: string, stop: () => void): boolean => {
  if (!stop) return;

  logger.log(`[${name}], stop`);

  try {
    stop?.();
    runningQuarks.delete(name);

    logger.log(`[${name}], stop, ok`);
    logger._log(`stopped "${name}"`);

    events.emit('stop', name);

    return true;
  } catch (error) {
    logger.error(`[${name}], stop, error:`, error);
    logger._error(`failed stopping "${name}"`);

    return false;
  }
};

export const isQuark = (quarkLike: unknown): quarkLike is Quark =>
  typeof quarkLike === 'object' &&
  'enabled' in quarkLike &&
  'start' in quarkLike &&
  'stop' in quarkLike;

export const validate = (quarkLike?: unknown): Quark =>
  isQuark(quarkLike)
    ? quarkLike
    : {
        enabled: false,
        start: '',
        stop: '',
      };

export const get = (name: string): Quark => loadedQuarks.get(name);

export const set = (name: string, quarkLike?: unknown): Promise<boolean> =>
  idb
    .set(name, validate(quarkLike), store)
    .then(async () => {
      loadedQuarks.set(name, await idb.get(name, store));
      events.emit('set', name);

      logger.log(`idb set, [${name}], ok:`, quarkLike);

      return true;
    })
    .catch((error) => {
      logger.error(`[${name}], set, error:`, error);

      return false;
    });

export const del = (name: string): Promise<boolean> =>
  idb
    .del(name, store)
    .then(() => {
      loadedQuarks.delete(name);
      events.emit('del', name);

      logger.log(`idb del, [${name}], ok`);

      return true;
    })
    .catch((error) => {
      logger.error(`idb del, [${name}], error:`, error);

      return false;
    });

export const start = (name: string): boolean => {
  const quark = get(name);

  if (runningQuarks.has(name) || !quark.enabled) return false;

  return _start(name, quark);
};

export const startAll = (): void => {
  const quarks = [...loadedQuarks.entries()].filter(([_, quark]) => quark.enabled);

  logger.log(`all [${quarks.map(([name]) => `"${name}"`).join(', ')}], start:`, quarks);
  logger._log('starting all quarks');

  quarks.forEach(([name, quark]) => _start(name, quark));
};

export const stop = (name: string): boolean => {
  if (!runningQuarks.has(name)) return false;

  return _stop(name, runningQuarks.get(name));
};

export const stopAll = (): void => {
  logger.log(`all [${[...runningQuarks.keys()].map((name) => `"${name}"`).join(', ')}], stop:`, [
    ...runningQuarks.entries(),
  ]);
  logger._log('stopping all quarks');

  runningQuarks.forEach((stop, name) => _stop(name, stop));
};

export const restart = (name: string): boolean => {
  logger.log(`[${name}], restart`);
  logger._log(`restarting "${name}"`);

  const ok = stop(name) && start(name);

  logger.log(`[${name}], restart, ${ok ? 'ok' : 'not ok'}`);
  logger._log(`${ok ? 'restarted' : 'failed restarting'} ${name}`);

  return ok;
};

/*
  note for future contributors / forkers:

  - this hook is absolutely horrendous. (please remake it)
*/
export const _useQuark = (
  name: string,
): {
  exists: boolean;
  manage: {
    del: () => Promise<boolean>;
    edit: (quark: Quark) => Promise<boolean>;
    restart: () => boolean;
    start: () => boolean;
    stop: () => boolean;
  };
  name: string;
  quark: Quark;
  running: boolean;
} => ({
  exists: loadedQuarks.has(name),
  manage: {
    del: () => del(name),
    edit: (quark: Quark) => set(name, quark),
    restart: () => restart(name),
    start: () => start(name),
    stop: () => stop(name),
  },
  name,
  quark: get(name),
  running: runningQuarks.has(name),
});

export const useQuark = (name: string): ReturnType<typeof _useQuark> => {
  const [quark, setQuark] = React.useState(_useQuark(name));

  React.useEffect(() => {
    const listener = ({ detail: quarkName }: CustomEvent<string>): void =>
      quarkName === name && setQuark(_useQuark(name));

    events
      .chainableOn('set', listener)
      .chainableOn('del', listener)
      .chainableOn('start', listener)
      .on('stop', listener);

    return () =>
      events
        .chainableOff('set', listener)
        .chainableOff('del', listener)
        .chainableOff('start', listener)
        .off('stop', listener);
  }, []);

  return quark;
};

export const useQuarks = (): Array<ReturnType<typeof _useQuark>> => {
  const [quarks, setQuarks] = React.useState(
    [...loadedQuarks.keys()].map((name) => _useQuark(name)),
  );

  React.useEffect(() => {
    const listener = (): void => setQuarks([...loadedQuarks.keys()].map((name) => _useQuark(name)));

    events
      .chainableOn('set', listener)
      .chainableOn('del', listener)
      .chainableOn('start', listener)
      .on('stop', listener);

    return () =>
      events
        .chainableOff('set', listener)
        .chainableOff('del', listener)
        .chainableOff('start', listener)
        .off('stop', listener);
  }, []);

  return quarks;
};
