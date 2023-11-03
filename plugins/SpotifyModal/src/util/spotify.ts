/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { webpack } from 'replugged';
import { lodash as _, api, fluxDispatcher, toast } from 'replugged/common';

import { HTTPResponse, SpotifyAccount, SpotifySocketPayloadEvents, SpotifyStore } from '../types';
import { logger } from './misc';
import { EventEmitter, events as globalEvents } from './events';

let events = new EventEmitter();
let persist = false;
let currentAccountId: string;

export const store = await webpack.waitForModule<SpotifyStore>(
  webpack.filters.byProps('getActiveSocketAndDevice'),
);

export const spotifyAccounts = store.spotifyModalAccounts || ({} as Record<string, SpotifyAccount>);

export const getTokenFromAccountId = (accountId: string): string =>
  spotifyAccounts[accountId]?.accessToken || '';

export const refreshSpotifyToken = async (
  accountId: string,
  oauth?: boolean,
): Promise<HTTPResponse<{ access_token: string }>> => {
  if (oauth) logger.error('(spotify)', 'oauth token refresh not implemented');
  else {
    const token = await api.get<{ access_token: string }>({
      url: `/users/@me/connections/spotify/${accountId}/access-token`,
    });

    if (token.ok) {
      fluxDispatcher.dispatch({
        type: 'SPOTIFY_ACCOUNT_ACCESS_TOKEN',
        accountId,
        accessToken: token.body.access_token,
      });

      spotifyAccounts[accountId].accessToken = token.body.access_token;
    }

    return token;
  }
};

export const sendSpotifyRequest = (
  accountId: string,
  endpoint: string,
  init: RequestInit,
  isRetrying?: boolean,
): Promise<Response> => {
  if (!accountId)
    return Promise.resolve(new Response('', { status: 401, statusText: 'No accountId provided' }));

  persist = true;

  return fetch(new URL(endpoint.replace(/^\//, ''), 'https://api.spotify.com/v1/me/'), {
    ...init,
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getTokenFromAccountId(accountId)}`,
    },
  }).then(async (res) => {
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
  });
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
  repeat_state: 'off',
  shuffle_state: false,
  is_playing: false,
  progress_ms: 0,
  timestamp: 0,
} as SpotifyApi.CurrentPlaybackResponse;

let playbackState: SpotifyApi.CurrentPlaybackResponse = _.clone(dummyState);

export const setState = (newState: SpotifyApi.CurrentPlaybackResponse): void => {
  playbackState = newState || _.clone(dummyState);

  logger.log('(spotify)', 'new state', _.clone(playbackState));

  events.emit('state', playbackState);
};

export const useState = (): SpotifyApi.CurrentPlaybackResponse => {
  const [state, setState] = React.useState(playbackState);

  React.useEffect(
    (): (() => void) | void =>
      events.on<SpotifyApi.CurrentPlaybackResponse>('state', (event): void =>
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

export const useTime = (): {
  duration: number;
  playing: boolean;
  progress: number;
  timestamp: number;
} => {
  const [duration, setDuration] = React.useState(playbackState?.item?.duration_ms || 0);
  const [playing, setPlaying] = React.useState(playbackState?.is_playing);
  const [progress, setProgress] = React.useState(playbackState?.progress_ms || 0);
  const [timestamp, setTimestamp] = React.useState(playbackState?.timestamp);

  React.useEffect(
    (): (() => void) | void =>
      events.on<SpotifyApi.CurrentPlaybackResponse>('state', (event): void => {
        setDuration(event.detail?.item?.duration_ms || 0);
        setPlaying(event.detail?.is_playing);
        setProgress(event.detail?.progress_ms || 0);
        setTimestamp(event.detail?.timestamp);
      }),
    [],
  );

  return { duration, playing, progress, timestamp };
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
}>('message', (event): void => {
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
        setCurrentAccountId(accountId);

        events.emit('stateUpdate', state);

        break;
      }
    }
  }
});
