/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { webpack } from 'replugged';
import { lodash as _, toast } from 'replugged/common';

import { HTTPResponse, SpotifyAccount, SpotifySocketPayloadEvents, SpotifyStore } from '../types';
import { logger } from './misc';
import { EventEmitter, events as globalEvents } from './events';

let events = new EventEmitter();
let persist = false;
let currentAccountId: string;

export const store = await webpack.waitForModule<SpotifyStore>(
  webpack.filters.byProps('getActiveSocketAndDevice'),
);

export const spotifyUtils = await webpack.waitForModule<{
  getAccessToken: (accountId: string) => Promise<HTTPResponse<{ access_token: string }>>;
}>(webpack.filters.byProps('SpotifyAPI'));

export const spotifyAccounts = store.spotifyModalAccounts || ({} as Record<string, SpotifyAccount>);

export const getTokenFromAccountId = (accountId: string): string =>
  spotifyAccounts[accountId]?.accessToken || '';

export const refreshSpotifyToken = async (
  accountId: string,
): Promise<HTTPResponse<{ access_token: string }>> => {
  const token = await spotifyUtils.getAccessToken(accountId);

  if (accountId in spotifyAccounts && token.ok)
    spotifyAccounts[accountId].accessToken = token.body.access_token;

  return token;
};

export const sendSpotifyRequest = async (
  accountId: string,
  endpoint: string,
  init: RequestInit,
  isRetrying?: boolean,
): Promise<Response> => {
  if (!accountId)
    return Promise.resolve(new Response('', { status: 401, statusText: 'No accountId provided' }));

  persist = true;

  const res = await fetch(new URL(endpoint.replace(/^\//, ''), 'https://api.spotify.com/v1/me/'), {
    ...init,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenFromAccountId(accountId)}`,
    },
  });

  if (res.status === 401) {
    if (!isRetrying) {
      logger.log('(spotify)', 'reauthing');

      const token = await refreshSpotifyToken(accountId);

      if (token.ok) {
        logger.log('(spotify)', 'retrying', endpoint);
        return await sendSpotifyRequest(accountId, endpoint, init, true);
      }
    }

    logger.log('(spotify)', 'retrying', endpoint, 'failed');
  }

  persist = false;

  return res;
};

const dummyState = {
  item: {
    album: { name: 'None', images: [{}] },
    artists: [{ name: 'None' }],
    name: 'None',
    type: 'track',
    duration_ms: 0,
  },
  device: {
    volume_percent: 0,
  },
  actions: {
    disallows: {
      resuming: true,
      seeking: true,
      skipping_next: true,
      skipping_prev: true,
      toggling_shuffle: true,
      toggling_repeat_context: true,
      toggling_repeat_track: true,
    },
  },
  repeat_state: 'off',
  shuffle_state: false,
  is_playing: false,
  progress_ms: 0,
  timestamp: 0,
  isDummy: true,
} as SpotifyApi.CurrentPlaybackResponse & { isDummy: boolean };

let playbackState: SpotifyApi.CurrentPlaybackResponse & { isDummy: boolean } = _.clone(dummyState);

export const setState = (newState: SpotifyApi.CurrentPlaybackResponse): void => {
  playbackState = newState?.item ? { ...newState, isDummy: false } : _.clone(dummyState);

  logger.log('(spotify)', 'new state', _.clone(playbackState));

  events.emit('state', playbackState);
};

export const useState = (): SpotifyApi.CurrentPlaybackResponse & { isDummy: boolean } => {
  const [state, setState] = React.useState(playbackState);

  React.useEffect(
    (): (() => void) | void =>
      events.on<SpotifyApi.CurrentPlaybackResponse & { isDummy: boolean }>('state', (event): void =>
        setState(event.detail),
      ),
    [],
  );

  return state;
};

export const setCurrentAccountId = (newCurrentAccountId: string): void => {
  currentAccountId = newCurrentAccountId;

  if (!currentAccountId) logger.log('(spotify)', 'clear current account');
  else logger.log('(spotify)', 'new active account', newCurrentAccountId);

  events.emit('activeAccount', newCurrentAccountId);
};

export const usePlayerControlStates = (): {
  disallows: SpotifyApi.DisallowsObject;
  duration: number;
  playing: boolean;
  progress: number;
  repeat: 'off' | 'context' | 'track';
  shuffle: boolean;
  timestamp: number;
  volume: number;
} => {
  const [duration, setDuration] = React.useState(playbackState?.item?.duration_ms || 0);
  const [playing, setPlaying] = React.useState(playbackState?.is_playing);
  const [progress, setProgress] = React.useState(playbackState?.progress_ms || 0);
  const [repeat, setRepeat] = React.useState(playbackState?.repeat_state || 'off');
  const [shuffle, setShuffle] = React.useState(playbackState?.shuffle_state);
  const [timestamp, setTimestamp] = React.useState(playbackState?.timestamp || 0);
  const [volume, setVolume] = React.useState(playbackState?.device?.volume_percent || 0);
  const [disallows, setDisallows] = React.useState(
    playbackState?.actions?.disallows || _.clone(dummyState.actions.disallows),
  );

  React.useEffect(
    (): (() => void) | void =>
      events.on<SpotifyApi.CurrentPlaybackResponse>('state', (event): void => {
        setDuration(event.detail?.item?.duration_ms || 0);
        setPlaying(event.detail?.is_playing);
        setProgress(event.detail?.progress_ms || 0);
        setRepeat(event.detail?.repeat_state || 'off');
        setShuffle(event.detail?.shuffle_state);
        setTimestamp(event.detail?.timestamp || 0);
        setVolume(playbackState?.device?.volume_percent || 0);
        setDisallows(playbackState?.actions?.disallows || _.clone(dummyState.actions.disallows));
      }),
    [],
  );

  return { disallows, duration, playing, progress, repeat, shuffle, timestamp, volume };
};

export const useControls = (): {
  setPlaying: (state: boolean) => void;
  setRepeat: (state: 'off' | 'context' | 'track') => void;
  setShuffle: (state: boolean) => void;
  setProgress: (position: number) => void;
  setVolume: (volume: number) => void;
  skip: (next: boolean) => void;
} => {
  const [activeAccountId, setActiveAccountId] = React.useState(currentAccountId);
  const setPlaying = React.useCallback(
    (state: boolean) => {
      void sendSpotifyRequest(activeAccountId, `player/${state ? 'play' : 'pause'}`, {
        method: 'PUT',
      });
    },
    [activeAccountId],
  );
  const setRepeat = React.useCallback(
    (state: 'off' | 'context' | 'track') => {
      void sendSpotifyRequest(activeAccountId, `player/repeat?state=${state}`, { method: 'PUT' });
    },
    [activeAccountId],
  );
  const setShuffle = React.useCallback(
    (state: boolean) => {
      void sendSpotifyRequest(activeAccountId, `player/shuffle?state=${state}`, { method: 'PUT' });
    },
    [activeAccountId],
  );
  const setProgress = React.useCallback(
    (position: number) => {
      void sendSpotifyRequest(activeAccountId, `player/seek?position_ms=${position}`, {
        method: 'PUT',
      });
    },
    [activeAccountId],
  );
  const setVolume = React.useCallback(
    (volume: number) => {
      void sendSpotifyRequest(
        activeAccountId,
        `player/volume?volume_percent=${Math.round(volume)}`,
        { method: 'PUT' },
      );
    },
    [activeAccountId],
  );
  const skip = React.useCallback(
    (next: boolean) => {
      void sendSpotifyRequest(activeAccountId, `player/${next ? 'next' : 'previous'}`, {
        method: 'POST',
      });
    },
    [activeAccountId],
  );

  React.useEffect(
    () =>
      events.on<string>('activeAccount', (event) => {
        setActiveAccountId(event.detail);
      }),
    [],
  );

  return { setPlaying, setRepeat, setShuffle, setProgress, setVolume, skip };
};

globalEvents.on('accountSwitch', () => {
  logger.log('(spotify)', 'clear states');

  setCurrentAccountId('');

  globalEvents.emit('showUpdate', false);
});

globalEvents.on<{
  accountId: string;
  data: SpotifySocketPayloadEvents;
}>('event', (event): void => {
  const { accountId, data } = event.detail;

  if (!currentAccountId) setCurrentAccountId(accountId);

  if (currentAccountId === accountId)
    switch (data.type) {
      case 'PLAYER_STATE_CHANGED':
        setState(data.event.state);
        break;

      case 'DEVICE_STATE_CHANGED': {
        if (!persist) {
          if (!data.event.devices.length) setCurrentAccountId('');

          globalEvents.emit('showUpdate', Boolean(data.event.devices.length));
          logger.log(
            '(spotify)',
            'showUpdate fired (player device state)',
            Boolean(data.event.devices.length),
          );
        } else {
          persist = false;
          logger.log('(spotify)', 'showUpdate not fired (persistence)');
        }

        break;
      }

      default:
        logger.log('(spotify)', 'unknown data', data);
    }
});

globalEvents.on<SpotifyApi.CurrentPlaybackResponse>('ready', async (): Promise<void> => {
  if (!store.spotifyModalAccounts) {
    toast.toast(
      "(SpotifyModal) .spotifyModalAccounts wasn't found on SpotifyStore. controls will not work. please report this on GitHub.",
      toast.Kind.FAILURE,
    );

    logger.error(
      "(spotify) critical: .spotifyModalAccounts wasn't found on SpotifyStore - the plaintext patch for it is likely broken.\nplease report this on GitHub.",
    );
  }

  if (store.shouldShowActivity()) {
    logger.log('(spotify)', 'fetching state');

    const accountIds = Object.keys(spotifyAccounts);

    let res: Response;
    let raw: string;

    for (const accountId of accountIds) {
      res = await sendSpotifyRequest(accountId, 'player', { method: 'GET' });
      raw = await res.clone().text();

      if (raw && res.ok) {
        const state = JSON.parse(raw) as SpotifyApi.CurrentPlaybackResponse;

        globalEvents.emit<{
          accountId: string;
          data: SpotifySocketPayloadEvents;
        }>('event', {
          accountId,
          data: {
            event: { state: { ...state, timestamp: Date.now() } },
            type: 'PLAYER_STATE_CHANGED',
          },
        });

        break;
      }
    }
  }
});
