import { React, fluxDispatcher } from 'replugged/common';

import { restartDiscordDialog } from '@shared';

import { config } from './config';
import { Modal } from './components';
import { events, logger } from './util';
import { SpotifyAccount, SpotifySocketPayloadEvents } from './types';

import './style.css';

export const renderModal = (): JSX.Element => (
  <div id='spotify-modal-root'>
    <Modal />
  </div>
);

export const emitEvent = (data: SpotifySocketPayloadEvents, account: SpotifyAccount): void => {
  if (data.type === 'PLAYER_STATE_CHANGED' && typeof data.event.state?.timestamp === 'number')
    data.event.state.timestamp = Date.now();

  events.emit('event', { accountId: account.accountId, data });
};

const postConnectionOpenListener = (): void => {
  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);

  logger.log('(start)', 'waited for POST_CONNECTION_OPEN');
  events.emit('ready');
};

// to detect account switches - we need to reset the modal
const loginSuccessListener = (): void => {
  events.emit('accountSwitch');
  fluxDispatcher.subscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);
};

export const start = (): void => {
  if (!document.getElementById('spotify-modal-root'))
    fluxDispatcher.subscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);

  fluxDispatcher.subscribe('LOGIN_SUCCESS', loginSuccessListener);
};

export const stop = async (): Promise<void> => {
  await restartDiscordDialog('SpotifyModal', config.get('pluginStopBehavior'));

  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);
};

export { Settings } from './components';

export * as util from './util';
export * as components from './components';
