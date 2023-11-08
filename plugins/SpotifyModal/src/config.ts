import { settings } from 'replugged';

export type ControlButtonKind =
  | 'shuffle'
  | 'skip-prev'
  | 'play-pause'
  | 'skip-next'
  | 'repeat'
  | 'blank';

export type VisibilityState = 'always' | 'hidden' | 'auto';

export interface DefaultConfig {
  controlsLayout: [
    ControlButtonKind,
    ControlButtonKind,
    ControlButtonKind,
    ControlButtonKind,
    ControlButtonKind,
  ];
  controlsVisibilityState: VisibilityState;
  debugging: boolean;
  hyperlinkURI: boolean;
  pluginStopBehavior: 'ask' | 'restart' | 'ignore';
  seekbarEnabled: boolean;
  seekbarVisibilityState: VisibilityState;
  spotifyAppClientId: string;
  spotifyAppRedirectURI: string;
  spotifyAppOauthTokens: Record<string, string>;
  skipPreviousShouldResetProgress: boolean;
  skipPreviousProgressResetThreshold: number;
}

export const defaultConfig: DefaultConfig = {
  controlsLayout: ['shuffle', 'skip-prev', 'play-pause', 'skip-next', 'repeat'],
  controlsVisibilityState: 'auto',
  debugging: false,
  hyperlinkURI: true,
  pluginStopBehavior: 'ask',
  seekbarEnabled: true,
  seekbarVisibilityState: 'always',
  spotifyAppClientId: '',
  spotifyAppRedirectURI: '',
  spotifyAppOauthTokens: {},
  skipPreviousShouldResetProgress: true,
  skipPreviousProgressResetThreshold: 0.15,
};

export const config = await settings.init('lib.evelyn.SpotifyModal', defaultConfig);
