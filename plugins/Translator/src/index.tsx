import React from 'react';

import { APIMessage } from 'discord-api-types/v9';

import { Injector, webpack } from 'replugged';
import { fluxDispatcher, i18n, toast } from 'replugged/common';
import { Tooltip } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';

import { TranslateIcon } from './components';
import { config, events, logger } from './util';
import { originalCache, translate, untranslate, untranslateAll } from './translator';

import './style.css';

const injector = new Injector();

interface MessageUpdateAction {
  type: 'MESSAGE_UPDATE';
  message: APIMessage;
  translated?: boolean;
}

export const translateMessage = async (message: APIMessage): Promise<void> => {
  const translateResult = await translate(message);

  if ('error' in translateResult) {
    logger.error('(translateAndUpdate) error:', translateResult);

    toast.toast(
      `Unable to translate message: ${String(translateResult.error)}`,
      toast.Kind.FAILURE,
    );
  } else
    fluxDispatcher.dispatch({
      type: 'MESSAGE_UPDATE',
      message: translateResult.message,
      translated: true,
    });
};

export const untranslateMessage = (messageId: string): void =>
  fluxDispatcher.dispatch({
    type: 'MESSAGE_UPDATE',
    message: untranslate(messageId),
  });

export const onMessageUpdate = ({ message, translated }: MessageUpdateAction): void => {
  if (!translated && originalCache.has(message.id)) void translateMessage(message);
};

export const untranslateAllMessages = (): void => {
  untranslateAll().forEach((message) =>
    fluxDispatcher.dispatch({ type: 'MESSAGE_UPDATE', message }),
  );

  logger.log('cleared all translations');
};

export const onDiscordLocaleChange = (): void =>
  !config.get('language') && untranslateAllMessages();

export const start = async (): Promise<void> => {
  const systemTagModule = await webpack.waitForModule<{
    renderSystemTag: (props: { message: APIMessage; compact: boolean }) => React.ReactNode;
  }>(webpack.filters.byProps('renderSystemTag'));

  if (systemTagModule?.renderSystemTag)
    injector.after(systemTagModule, 'renderSystemTag', ([args], res): React.ReactNode => {
      return [
        res,
        originalCache.has(args?.message?.id) && (
          <Tooltip text='Translated'>
            <TranslateIcon
              className={mergeClassNames('translated-icon', args?.compact ? 'compact' : 'cozy')}
            />
          </Tooltip>
        ),
      ];
    });
  else
    logger.warn(
      '(start)',
      "couldn't find <systemTagModule>.renderSystemTag. (you won't see the `translated` tag on translated messages)",
    );

  injector.utils.addPopoverButton((message) => ({
    icon: TranslateIcon,
    label: originalCache.has(message.id) ? 'Untranslate' : 'Translate',
    onClick: (_, message): void =>
      originalCache.has(message.id)
        ? untranslateMessage(message.id)
        : void translateMessage(message),
  }));

  fluxDispatcher.subscribe<MessageUpdateAction>('MESSAGE_UPDATE', onMessageUpdate);
  events.on('languageChanged', untranslateAllMessages);
  i18n.addListener('locale', onDiscordLocaleChange);
};

export const stop = (): void => {
  fluxDispatcher.unsubscribe<MessageUpdateAction>('MESSAGE_UPDATE', onMessageUpdate);
  events.off('languageChanged', untranslateAllMessages);
  i18n.removeListener('locale', onDiscordLocaleChange);

  injector.uninjectAll();

  untranslateAllMessages();
};

export { Settings } from './components';
export * as components from './components';
export * as translator from './translator';
export * as util from './util';
