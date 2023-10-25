import { common, components } from 'replugged';
import { config } from './settings';

const { modal } = common;

const { Button } = components;

declare global {
  interface Window {
    DiscordNative: {
      app: {
        relaunch: () => void;
      };
    };
  }
}

export const start = (): void => {};

export const stop = async (): Promise<void> => {
  const res =
    config.get('pluginStopBehavior') === 'ask'
      ? await modal.confirm({
          title: 'Restart Discord',
          body: 'It is recommended that you restart Discord after reloading / disabling NoSpotifyPause. Restart now? (Control this behavior in Settings)',
          confirmText: 'Yes',
          cancelText: 'No',
          confirmColor: Button.Colors.RED,
        })
      : config.get('pluginStopBehavior') === 'restartDiscord';

  if (res) window.DiscordNative.app.relaunch();
};

export * from './settings';
