import { settings } from 'replugged';

export type ControlButtonKinds =
  | string
  | 'shuffle'
  | 'skip-prev'
  | 'play-pause'
  | 'skip-next'
  | 'repeat'
  | 'blank';

export type PluginStopBehaviors = string | 'ask' | 'restart' | 'ignore';

export type VisibilityStates = string | 'always' | 'hidden' | 'auto';

export const defaultConfig = {
  controlsLayout: ['shuffle', 'skip-prev', 'play-pause', 'skip-next', 'repeat'] as [
    ControlButtonKinds,
    ControlButtonKinds,
    ControlButtonKinds,
    ControlButtonKinds,
    ControlButtonKinds,
  ],
  controlsVisibilityState: 'auto' as VisibilityStates,
  debugging: false,
  hyperlinkURI: true,
  pluginStopBehavior: 'ask' as PluginStopBehaviors,
  seekbarEnabled: true,
  seekbarVisibilityState: 'always' as VisibilityStates,
  spotifyAppClientId: '',
  spotifyAppRedirectURI: '',
  spotifyAppOauthTokens: {} as Record<string, string>,
  skipPreviousShouldResetProgress: true,
  skipPreviousProgressResetThreshold: 0.15,
};

export type DefaultConfig = typeof defaultConfig;
export type DefaultConfigKeys = keyof DefaultConfig;

export const config = await settings.init('lib.evelyn.SpotifyModal', defaultConfig);
