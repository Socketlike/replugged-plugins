import { getByStoreName } from 'replugged/webpack';

type FluxStore = ReturnType<typeof getByStoreName>;

export interface SpotifyStore extends FluxStore {
  getActiveSocketAndDevice(): { socket: { accountId: string } };
  getPlayerState(id: string):
    | (Record<string, unknown> & {
        account: ConnectedAccount;
        track: {
          album: { image: { url: string }; name: string };
          // eslint-disable-next-line @typescript-eslint/naming-convention
          artists: Array<{ name: string; external_urls: { spotify: string } }>;
          name: string;
          id: string;
          duration: number;
        };
        startTime: number;
      })
    | null;
  getActivity(): {
    timestamps: { start: number; end: number };
  } | null;
}

export interface ConnectedAccount {
  name: string;
  id: string;
  type: string;
  revoked: boolean;
  accessToken?: string;
}
