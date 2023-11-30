import React from 'react';

import { APIMessage } from 'discord-api-types/v9';

import { Injector, webpack } from 'replugged';
import { fluxDispatcher, toast } from 'replugged/common';
import { Tooltip } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';

import { TranslateIcon } from './components';
import { logger } from './util';
import {
  translateMessage,
  translatedMessageExists,
  untranslateAllMessages,
  untranslateMessage,
} from './translator';

import './style.css';

const injector = new Injector();

interface MessageUpdateAction {
  type: 'MESSAGE_UPDATE';
  message: APIMessage;
  translated?: boolean;
}

export const translateAndUpdateMessage = async (message: APIMessage): Promise<void> => {
  const translateResult = await translateMessage(message);

  if ('error' in translateResult)
    toast.toast(
      `Unable to translate message: ${String(translateResult.error)}`,
      toast.Kind.FAILURE,
    );
  else {
    fluxDispatcher.dispatch({
      type: 'MESSAGE_UPDATE',
      message: translateResult.message,
      translated: true,
    });

    toast.toast('Translated message', toast.Kind.SUCCESS);
  }
};

export const untranslateAndUpdateMessage = (message: APIMessage): void => {
  fluxDispatcher.dispatch({
    type: 'MESSAGE_UPDATE',
    message: untranslateMessage(message),
  });

  toast.toast('Untranslated message', toast.Kind.SUCCESS);
};

export const untranslateAndUpdateAllMessages = (): void =>
  untranslateAllMessages().forEach((message) =>
    fluxDispatcher.dispatch({
      type: 'MESSAGE_UPDATE',
      message,
    }),
  );

export const onMessageUpdate = ({ message, translated }: MessageUpdateAction): void => {
  if (!translated && translatedMessageExists(message.id)) void translateAndUpdateMessage(message);
};

export const start = async (): Promise<void> => {
  const systemTagModule = await webpack.waitForModule<{
    renderSystemTag: (props: { message: APIMessage; compact: boolean }) => React.ReactNode;
  }>(webpack.filters.byProps('renderSystemTag'));

  if (systemTagModule?.renderSystemTag)
    injector.after(systemTagModule, 'renderSystemTag', ([args], res): React.ReactNode => {
      return [
        res,
        translatedMessageExists(args?.message?.id) && (
          <Tooltip text='Translated'>
            <TranslateIcon
              className={mergeClassNames('translated-icon', args?.compact ? 'compact' : 'cozy')}
            />
          </Tooltip>
        ),
      ];
    });
  else logger.warn('(start)', "couldn't find systemTagModule");

  injector.utils.addPopoverButton((message) => ({
    icon: TranslateIcon,
    label: translatedMessageExists(message.id) ? 'Untranslate' : 'Translate',
    onClick: (_, message): void => {
      if (translatedMessageExists(message.id)) untranslateAndUpdateMessage(message);
      else void translateAndUpdateMessage(message);
    },
  }));

  fluxDispatcher.subscribe<MessageUpdateAction>('MESSAGE_UPDATE', onMessageUpdate);
};

export const stop = (): void => {
  fluxDispatcher.unsubscribe<MessageUpdateAction>('MESSAGE_UPDATE', onMessageUpdate);

  injector.uninjectAll();

  untranslateAndUpdateAllMessages();
};

export { Settings } from './components';
export * as components from './components';
export * as translator from './translator';
export * as util from './util';
