import { Logger } from 'replugged';

const log = Logger.plugin('SpotifyModal', '#1DB954');

const BASE_URL = 'https://api.spotify.com/v1/';
export const spotify = {
  async seekTo(token: string, position: number): Promise<number> {
    if (!token) {
      log.error('missing token for request');
      return 0;
    }

    const url = new URL('me/player/seek', BASE_URL);
    url.searchParams.set('position_ms', Math.floor(position).toString());

    return fetch(url, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.status)
      .catch((e) => {
        log.error("couldn't make request to Spotify", e);
        return 0;
      });
  },
};

export const classNameFactory = (classNames: Record<string, boolean>): string =>
  Object.entries(classNames)
    .filter(([_, enabled]) => enabled)
    .map(([className]) => className.trim())
    .join(' ');
