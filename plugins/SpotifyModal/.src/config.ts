import { settings } from 'replugged';

export type ControlButtonKind =
  | 'shuffle'
  | 'skip-prev'
  | 'play-pause'
  | 'skip-next'
  | 'repeat'
  | 'blank';

export type VisibilityState = 'always' | 'hidden' | 'auto';

export const defaultConfig = {
  controlsLayout: ['shuffle', 'skip-prev', 'play-pause', 'skip-next', 'repeat'] as [
    ControlButtonKind,
    ControlButtonKind,
    ControlButtonKind,
    ControlButtonKind,
    ControlButtonKind,
  ],
  controlsVisibilityState: 'auto' as VisibilityState,
  debugging: false,
  hyperlinkURI: true,
  pluginStopBehavior: 'ask' as 'ask' | 'restart' | 'ignore',
  seekbarEnabled: true,
  seekbarVisibilityState: 'always' as VisibilityState,
  spotifyAppClientId: '',
  spotifyAppRedirectURI: '',
  spotifyAppOauthTokens: {} as Record<string, string>,
  skipPreviousShouldResetProgress: true,
  skipPreviousProgressResetThreshold: 0.15,
};

export type DefaultConfig = typeof defaultConfig;

export const config = await settings.init('lib.evelyn.SpotifyModal', defaultConfig);
