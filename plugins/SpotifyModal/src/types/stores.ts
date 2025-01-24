import type { flux } from 'replugged/common';

export declare class SpotifyStore extends flux.Store {
  public shouldShowActivity(): boolean;
  public getPlayableComputerDevices(): Array<{
    socket: {
      accessToken: string;
      accountId: string;
      connectionId: string;
      isPremium: boolean;
      socket: WebSocket;
      connected: boolean;
    };
    device: {
      id: string;
      name: string;
      type: string;
    };
  }>;
}

export namespace SpotifyStore {
  export type PayloadEvents =
    | {
        event: {
          state: SpotifyApi.CurrentPlaybackResponse;
        };
        type: 'PLAYER_STATE_CHANGED';
      }
    | {
        event: {
          devices: SpotifyApi.UserDevice[];
        };
        type: 'DEVICE_STATE_CHANGED';
      };

  export interface Account {
    accessToken: string;
    accountId: string;
    connectionId: string;
    isPremium: boolean;
    socket: WebSocket;
  }
}

export declare class ConnectedAccountsStore extends flux.Store {
  public getAccounts(): ConnectedAccountsStore.ConnectedAccount[];
  public getAccount(
    id: string | undefined,
    type?: string,
  ): ConnectedAccountsStore.ConnectedAccount | undefined;
}

export namespace ConnectedAccountsStore {
  export interface ConnectedAccount {
    accessToken: string;
    id: string;
    type: string;
    showActivity: boolean;
  }
}
