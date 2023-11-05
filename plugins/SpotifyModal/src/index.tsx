import { React, fluxDispatcher } from 'replugged/common';
import { ErrorBoundary } from 'replugged/components';

import { restartDiscordDialog } from '@shared';

import { mergeClassNames } from '@shared/dom';

import { config } from './config';
import { ErrorPlaceholder, Modal } from './components';
import { containerClasses, events, logger } from './util';
import { SpotifyAccount, SpotifySocketPayloadEvents } from './types';

import './style.css';

export const renderModal = (): JSX.Element => (
  <div id='spotify-modal-root'>
    <ErrorBoundary
      fallback={
        <div
          id='spotify-modal'
          className={mergeClassNames('spotify-modal', containerClasses?.container)}>
          <div className='main'>
            <ErrorPlaceholder
              text='Something went wrong while rendering the modal :('
              subtext='See Console output for more details.'
            />
          </div>
        </div>
      }
      onError={(error: Error, message: React.ErrorInfo) =>
        logger._.error('(modal)', `rendering Modal failed\n`, error, '\n', message)
      }>
      <Modal />
    </ErrorBoundary>
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
