import { loadAll, startAll, stopAll } from './quark';

import './style.css';

export const start = (): void => {
  loadAll();
  startAll();
};

export const stop = (): void => stopAll();

export { Settings, Editor, openEditor } from './components';
export { config } from './util';
export * as quark from './quark';
