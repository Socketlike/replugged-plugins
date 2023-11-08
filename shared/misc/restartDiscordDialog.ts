import { modal } from 'replugged/common';
import { Button } from 'replugged/components';

export const restartDiscordDialog = async (
  pluginName: string,
  behavior: string | 'ask' | 'restart' | 'ignore',
): Promise<void> =>
  (
    behavior === 'ask'
      ? await modal.confirm({
          title: 'Restart Discord',
          body: `It is recommended that you restart Discord after reloading / disabling ${pluginName}. Restart now?`,
          confirmText: 'Yes',
          cancelText: 'No',
          confirmColor: Button.Colors.RED,
        })
      : behavior === 'restart'
  )
    ? window.DiscordNative.app.relaunch()
    : void 0;
