/* eslint-disable no-implicit-coercion */
import { Injector, Logger, webpack } from 'replugged';

let startTime = performance.now();
let store: SpotifyStore;
let injected: boolean;

const injector = new Injector();
const logger = Logger.plugin('SpotifyListenAlong');

export const getStore = async (): Promise<boolean> =>
  Boolean(
    store ||
      (store = await webpack.waitForModule<SpotifyStore>(
        webpack.filters.byProps('getActiveSocketAndDevice'),
      )),
  );

export const inject = async (): Promise<void> => {
  try {
    if (!injected && (await getStore()))
      injected = !!injector.after(store, 'getActiveSocketAndDevice', (_, res) => {
        if (res?.socket) res.socket.isPremium = true;
        return res;
      });
  } catch (error) {
    logger.error('An error occurred while injecting to store.', error);
  }

  if (!injected) {
    logger.log('Store is not injected. Next attempt in 20 seconds.');
    setTimeout(inject, 20e3);
  } else logger.log(`Injected; Took ${performance.now() - startTime}ms.`);
};

export const start = async (): Promise<void> => await inject();
export const stop = (): void => injector.uninjectAll();
