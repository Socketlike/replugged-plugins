import { restartDiscordDialog } from '@shared/misc';

import { config } from './settings';

export const start = (): void => {};

export const stop = (): Promise<void> =>
  restartDiscordDialog('NoSpotifyPause', config.get('pluginStopBehavior'));

export * from './settings';
