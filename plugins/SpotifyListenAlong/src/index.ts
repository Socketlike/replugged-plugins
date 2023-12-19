import { Injector, Logger, webpack } from 'replugged';

const injector = new Injector();
const logger = Logger.plugin('SpotifyListenAlong', '#1DB954');

export const start = async (): Promise<void> => {
  const store = await webpack.waitForModule<{
    getActiveSocketAndDevice(): {
      socket: {
        isPremium: boolean;
      };
    };
  }>(webpack.filters.byProps('getActiveSocketAndDevice'));

  if (store)
    injector.after(store, 'getActiveSocketAndDevice', (_, res) => {
      if (res?.socket) res.socket.isPremium = true;
      return res;
    });
  else logger.error('SpotifyStore not found');
};

export const stop = (): void => injector.uninjectAll();
