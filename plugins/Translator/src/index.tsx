import React from 'react';

import { APIMessage } from 'discord-api-types/v9';

import { Injector, webpack } from 'replugged';
import { fluxDispatcher, lodash, toast } from 'replugged/common';
import { Tooltip } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';

import { TranslateIcon } from './Icon';
import { config } from './Settings';
import { translate } from './translator';
import { logger } from './util';

const injector = new Injector();

interface MessageUpdateAction {
  type: 'MESSAGE_UPDATE';
  message: APIMessage;
  translated?: boolean;
}

interface MessageTagModule {
  renderSystemTag: (props: { message: APIMessage }) => React.ReactNode;
}

export const translatedMessages = new Map<
  string,
  { original: string; translated: string; message: APIMessage }
>();

export const translateMessage = async (message: APIMessage): Promise<void> => {
  const original = message.content;
  const translated = await translate(original);

  if ('error' in translated) {
    logger.error(
      '(translateMessage)',
      'failed',
      `("${config.get('engine')}", "${config.get('language') || 'discord'}"):`,
      translated.error,
    );
    toast.toast(`Unable to translate message: ${String(translated.error)}`, toast.Kind.FAILURE);
  } else {
    fluxDispatcher.dispatch({
      type: 'MESSAGE_UPDATE',
      message: lodash.assign(lodash.clone(message), { content: translated.text }),
      translated: true,
    });

    translatedMessages.set(message.id, {
      original,
      message: lodash.clone(message),
      translated: translated.text,
    });

    toast.toast('Translated message.', toast.Kind.SUCCESS);
  }
};

export const onMessageUpdate = ({ message, translated }: MessageUpdateAction): void => {
  if (!translated && translatedMessages.has(message.id)) {
    if (translatedMessages.get(message.id).original !== message.content)
      void translateMessage(message);
    else
      fluxDispatcher.dispatch({
        type: 'MESSAGE_UPDATE',
        message: lodash.assign(lodash.clone(message), {
          content: translatedMessages.get(message.id).translated,
        }),
        translated: true,
      });
  }
};

export const start = async (): Promise<void> => {
  const messageTagModule = await webpack.waitForModule<MessageTagModule>(
    webpack.filters.byProps('renderSystemTag'),
  );

  const botTagCozyClasses = await webpack.waitForModule<{ botTagCozy: string }>(
    webpack.filters.byProps('botTagCozy'),
  );

  if (messageTagModule?.renderSystemTag)
    injector.after(messageTagModule, 'renderSystemTag', ([args], res): React.ReactNode => {
      return [
        res,
        translatedMessages.has(args?.message?.id) && (
          <Tooltip text='Translated'>
            <TranslateIcon
              className={mergeClassNames(
                'translator-translated-tag',
                botTagCozyClasses?.botTagCozy,
              )}
            />
          </Tooltip>
        ),
      ];
    });

  injector.utils.addPopoverButton((message) => ({
    icon: TranslateIcon,
    label: translatedMessages.has(message.id) ? 'Untranslate' : 'Translate',
    onClick: (_, message): void => {
      if (translatedMessages.has(message.id)) {
        message.content = translatedMessages.get(message.id).original;
        translatedMessages.delete(message.id);

        fluxDispatcher.dispatch({ type: 'MESSAGE_UPDATE', message });
      } else void translateMessage(message);
    },
  }));

  fluxDispatcher.subscribe<MessageUpdateAction>('MESSAGE_UPDATE', onMessageUpdate);
};

export const stop = (): void => {
  fluxDispatcher.unsubscribe<MessageUpdateAction>('MESSAGE_UPDATE', onMessageUpdate);

  injector.uninjectAll();

  [...translatedMessages.entries()].forEach(([id, { original, message }]): void => {
    message.content = original;

    translatedMessages.delete(id);

    fluxDispatcher.dispatch({ type: 'MESSAGE_UPDATE', message });
  });
};

export * from './Settings';
export * from './Icon';
export * from './translator';
export * from './util';
