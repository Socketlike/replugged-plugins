import React from 'react';

import { fluxDispatcher } from 'replugged/common';
import { ErrorBoundary } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';
import { hackyCSSFix, restartDiscordDialog } from '@shared/misc';

import { config } from './config';
import { ErrorPlaceholder, Modal } from './components';
import { containerClasses, globalEvents, initMisc, initSpotify, logger } from './util';
import { SpotifyStore } from './types';

import './style/index.css';

let styleElement: HTMLLinkElement;

export const renderModal = (): React.ReactElement => (
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
        logger._.error('(modal)', `rendering failed\n`, error, '\n', message)
      }>
      <Modal />
    </ErrorBoundary>
  </div>
);

export const emitEvent = (
  data: SpotifyStore.PayloadEvents,
  account: SpotifyStore.Account,
): void => {
  if (data.type === 'PLAYER_STATE_CHANGED' && typeof data.event.state?.timestamp === 'number')
    data.event.state.timestamp = Date.now();

  globalEvents.emit('event', { accountId: account.accountId, data });
};

const postConnectionOpenListener = (): void => {
  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);

  logger.log('(start)', 'waited for POST_CONNECTION_OPEN');
  globalEvents.emit('ready');

  // hacky fix for loading css after timing out
  if (!document.querySelector('link[href*="lib.evelyn.SpotifyModal"]')) {
    logger._.log(
      '(start)',
      'manually loading CSS since Replugged timed us out (we still loaded successfully!)',
    );

    styleElement = hackyCSSFix('lib.evelyn.SpotifyModal')!;
  }
};

// to detect account switches - we need to reset the modal
const loginSuccessListener = (): void => {
  globalEvents.emit('accountSwitch');
  fluxDispatcher.subscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);
};

export const start = async (): Promise<void> => {
  await Promise.allSettled([initMisc(), initSpotify()]);

  if (!document.getElementById('spotify-modal-root'))
    fluxDispatcher.subscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);

  fluxDispatcher.subscribe('LOGIN_SUCCESS', loginSuccessListener);
};

export const stop = async (): Promise<void> => {
  await restartDiscordDialog('SpotifyModal', config.get('pluginStopBehavior'));

  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', postConnectionOpenListener);
  fluxDispatcher.unsubscribe('LOGIN_SUCCESS', loginSuccessListener);

  styleElement?.remove?.();
};

export { Settings } from './components';

export * as util from './util';
export * as components from './components';
