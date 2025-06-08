import { Injector, Logger } from 'replugged';
import { getOwnerInstance, waitFor } from 'replugged/util';
import webpack from 'replugged/webpack';

import { ConnectedAccountsUtils, SpotifyStore } from './types';
import { default as Main } from './Modal';

import './style.css';

const log = Logger.plugin('SpotifyModal', '#1DB954');
const injector = new Injector();

let store = webpack.getByStoreName<SpotifyStore>('SpotifyStore');
let connectedAccountsUtils: ConnectedAccountsUtils = webpack.getByProps('refreshAccessToken');
let userAreaElement: Element;
let forceUpdateUserArea: () => void;

let modalInstance: React.ReactElement;

export function start(): void {
  void (async () => {
    store ??= webpack.getByStoreName('SpotifyStore');
    connectedAccountsUtils ??= await webpack.waitForProps(['refreshAccountToken']);

    userAreaElement = await waitFor('[class^=panels_] > [class^=container_]');

    if (!userAreaElement) {
      log.error('unable to get user area element. maybe the selector broke?');
      return;
    }

    const owner = getOwnerInstance(userAreaElement);

    if (!owner) {
      log.error('unable to get user area React owner instance.');
      return;
    }

    modalInstance = <Main store={store} connectedAccountsUtils={connectedAccountsUtils} />;

    injector.after(owner, 'render', (_, res) => {
      return [modalInstance, res];
    });

    forceUpdateUserArea = () => owner.forceUpdate();

    forceUpdateUserArea();
  })();
}

export function stop(): void {
  injector.uninjectAll();
  forceUpdateUserArea?.();
}

export { default as Settings } from './Settings';
