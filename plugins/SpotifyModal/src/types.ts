import { getByStoreName } from 'replugged/webpack';

export interface SpotifyStore extends ReturnType<typeof getByStoreName> {
  getActiveSocketAndDevice(): { socket: { accountId: string } };
  getPlayerState(id: string):
    | (Record<string, unknown> & {
        track: {
          album: { image: { url: string } };
          artists: Array<{ name: string; external_urls: { spotify: string } }>;
          name: string;
          id: string;
        };
      })
    | null;
  getActivity(): Record<string, unknown> | null;
}
