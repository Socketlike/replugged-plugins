import { flux } from 'replugged/common';

export declare class ThemeStore extends flux.Store {
  public theme: 'dark' | 'light';
}

export interface Quark {
  enabled: boolean;
  start: string;
  stop: string;
}
