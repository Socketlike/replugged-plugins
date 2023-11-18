import { fluxDispatcher } from 'replugged/common';

import { startAll, stopAll } from './quark';

import './style.css';

interface CustomWindow extends Window {
  _QUARK_STARTED?: null;
}

declare const window: CustomWindow;

const postConnectionListener = (): void => {
  window._QUARK_STARTED = null;

  startAll();

  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', postConnectionListener);
};

export const start = (): void =>
  '_QUARK_STARTED' in window
    ? startAll()
    : fluxDispatcher.subscribe('POST_CONNECTION_OPEN', postConnectionListener);

export const stop = (): void => {
  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', postConnectionListener);
  stopAll();
};

export { Settings } from './components';
export * as components from './components';
export * as util from './util';
export * as quark from './quark';
