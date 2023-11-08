import { DefaultConfig } from '../config';
import { SpotifyStore } from './stores';

type Values<T> = T[keyof T];

export type GlobalEventMap = {
  [key in 'accountSwitch' | 'ready']: undefined;
} & {
  event: { accountId: string; data: SpotifyStore.PayloadEvents };
  showUpdate: boolean;
  settingsUpdate: Values<{
    [Property in keyof DefaultConfig]: {
      key: Property;
      value: DefaultConfig[Property];
    };
  }>;
};
