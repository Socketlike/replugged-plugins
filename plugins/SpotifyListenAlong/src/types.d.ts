type RawModule = import('replugged').types.RawModule;

declare interface SpotifyStore extends RawModule {
  getActiveSocketAndDevice: () => {
    socket: {
      isPremium: boolean;
    };
  };
}
