import React from 'react';

import { APIMessage } from 'discord-api-types/v9';

import { Injector, webpack } from 'replugged';
import { fluxDispatcher, i18n, toast } from 'replugged/common';

import { TranslateButton, TranslateIcon, TranslateOffIcon, TranslatedTag } from './components';
import { config, events, logger } from './util';
import { _translate, originalCache, translate, untranslate, untranslateAll } from './translator';

import './style.css';

const injector = new Injector();

const messages = await webpack.waitForModule<{
  sendMessage: (id: string, data: { content: string }, _: unknown, __: unknown) => Promise<unknown>;
}>(webpack.filters.byProps('sendMessage'));

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

export const untranslateAllMessages = (): void => {
  untranslateAll().forEach((message) =>
    fluxDispatcher.dispatch({ type: 'MESSAGE_UPDATE', message }),
  );

  logger.log('cleared all translations');
};

export const onMessageUpdate = ({ message, translated }: MessageUpdateAction): void => {
  if (!translated && originalCache.has(message.id)) void translateMessage(message);
};

export const onDiscordLocaleChange = (): void =>
  !config.get('yourLanguage') && untranslateAllMessages();

export const renderTranslatedTag = (message: APIMessage): React.ReactNode =>
  originalCache.has(message?.id) && <TranslatedTag />;

export const start = async (): Promise<void> => {
  const chatBarButtons = await webpack.waitForModule<{
    type: (props: { type: { analyticsName?: string } }) => React.ReactElement;
  }>(webpack.filters.bySource('default.getSentUserIds()'));

  injector.after(chatBarButtons, 'type', ([args], res): React.ReactElement => {
    const buttonElement = ['normal', 'sidebar'].includes(args?.type?.analyticsName) && (
      <TranslateButton key='translate' />
    );

    if (res?.props?.children?.[0]?.key === 'gift') res.props.children.splice(1, 0, buttonElement);
    else if (res) res.props.children.unshift(buttonElement);

    return res;
  });

  injector.utils.addPopoverButton((message) => ({
    icon: originalCache.has(message.id) ? TranslateOffIcon : TranslateIcon,
    label: originalCache.has(message.id) ? 'Untranslate' : 'Translate',
    onClick: (_, message): void =>
      originalCache.has(message.id)
        ? untranslateMessage(message.id)
        : void translateMessage(message),
  }));

  injector.instead(messages, 'sendMessage', async (args, orig) => {
    if (config.get('sendTranslateEnabled'))
      args[1].content = (await _translate(args[1].content, true)).text;

    return orig(...args);
  });

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
