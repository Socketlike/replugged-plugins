import { React } from 'replugged/common';

import { init } from 'replugged/settings';

// can't use an interface for this
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Config = {
  v: number;

  'general.reduceMotion': 'discord' | boolean;

  'controls.enabled': boolean;
  'controls.collapseOnBlur': boolean;

  'seekbar.enabled': boolean;
  'seekbar.collapseOnBlur': boolean;
};

const config = await init<Config, keyof Config>('lib.evelyn.SpotifyModal', {
  v: 0,

  'controls.enabled': true,
  'controls.collapseOnBlur': false,

  'seekbar.enabled': true,
  'seekbar.collapseOnBlur': false,
});

const currentConfigVersion = config.get('v');

if (currentConfigVersion === 0) {
  const controlsVisibilityState =
    // @ts-expect-error - can't fix this
    config.get('controlsVisibilityState') as 'always' | 'hidden' | 'auto';

  // @ts-expect-error - can't fix this
  const seekbarEnabled: boolean = config.get('seekbarEnabled');
  const seekbarVisibilityState =
    // @ts-expect-error - can't fix this
    config.get('controlsVisibilityState') as 'always' | 'hidden' | 'auto';

  config.set('controls.enabled', controlsVisibilityState !== 'hidden');
  config.set('controls.collapseOnBlur', controlsVisibilityState === 'auto');

  config.set('seekbar.enabled', seekbarEnabled);
  config.set('seekbar.collapseOnBlur', seekbarVisibilityState === 'auto');

  config.set('v', 1);
}

const events = new EventTarget();

const origSet = config.set;
const origDelete = config.delete;

config.set = function <T extends keyof Config, D extends Config[T]>(key: T, value: D) {
  origSet.call(this, key, value);

  events.dispatchEvent(new CustomEvent('set', { detail: { key } }));
};

config.delete = function <T extends keyof Config>(key: T): boolean {
  const res = origDelete.call(this, key);

  if (res) events.dispatchEvent(new CustomEvent('delete', { detail: { key } }));

  return res;
};

/*
  this uses the 2 monkey patches above to work

  due to this, config modifications that does not use this settings instance specifically
  will not update any React UI that is using this hook.
*/
export const useConfig = <T extends keyof Config, D extends Config[T]>(key: T, fallback?: D): D => {
  const [state, setState] = React.useState(config.get(key, fallback));

  React.useEffect(() => {
    const listener = (e: Event): void => {
      const {
        detail: { key: k },
      } = e as CustomEvent<{ key: T }>;

      if (k === key) setState(config.get(k));
    };

    events.addEventListener('set', listener);
    events.addEventListener('delete', listener);

    return () => {
      events.removeEventListener('set', listener);
      events.removeEventListener('delete', listener);
    };
  }, []);

  return state as D;
};

export default config;
