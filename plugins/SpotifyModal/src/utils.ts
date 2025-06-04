const BASE_URL = 'https://api.spotify.com/v1/';
export const spotify = {
  async seekTo(token: string, position: number): Promise<boolean> {
    if (!token) return false;

    const url = new URL('me/player/seek', BASE_URL);
    url.searchParams.set('position_ms', Math.floor(position).toString());

    return fetch(url, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.ok)
      .catch(() => false);
  },
};
