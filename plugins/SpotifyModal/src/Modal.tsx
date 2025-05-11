import React from 'react';
import { Logger } from 'replugged';
import { ErrorBoundary } from 'replugged/components';

import { SpotifyStore } from './types';

const log = Logger.plugin('SpotifyModal', '#1DB954');

export const ModalFallback = (): React.ReactElement => (
  <>uh oh. something went wrong while rendering the modal.</>
);

export const Modal = (props: {
  store: SpotifyStore;
  fluxHooks: typeof import('replugged/common').fluxHooks;
}): React.ReactElement => {
  const { store, fluxHooks } = props;

  const [state, setState] = React.useState<ReturnType<typeof store.getPlayerState>>();
  const [active, setActive] = React.useState(false);
  const [paused, setPaused] = React.useState(true);

  const socket = fluxHooks.useStateFromStores([store], () => {
    const socket = store.getActiveSocketAndDevice()?.socket;
    const _state = store.getPlayerState(socket?.accountId);
    const _active = Boolean(socket);

    if (active !== _active) {
      log.log('active state update', _active);
      setActive(_active);
    }

    if ((!socket || _active) && state !== _state) {
      if (_state) {
        log.log('player state update', _state);
        setState(_state);
      }

      if (paused !== Boolean(_state)) setPaused(Boolean(_state));
    }

    return socket;
  });

  const trackNameElement = React.useRef<HTMLAnchorElement>();
  const artistsElement = React.useRef<HTMLDivElement>();

  function handleOverflow(element: HTMLElement): void {
    if (!element?.parentElement) return;

    if (element.scrollWidth > element.parentElement.clientWidth) {
      // 60px/s
      element.style.animationDuration = `${(element.scrollWidth / 45) * 1.1}s`;
      element.style.animationDelay = `-${(element.scrollWidth / 45) * 1.1 * 0.449}s`;
      element.classList.add('overflow');
    } else element.classList.remove('overflow');
  }

  React.useEffect(() => {
    handleOverflow(trackNameElement.current);
    handleOverflow(artistsElement.current);
  }, [state]);

  return active && state ? (
    <>
      <div className='track-details details'>
        <span className='cover-art-container'>
          <img className='cover-art' src={state.track.album?.image?.url} />
        </span>
        <div className='container'>
          <div className='track-name-container'>
            <a
              ref={(e) => {
                handleOverflow(e);
                trackNameElement.current = e;
              }}
              className='track-name'
              href={state.track.id && `https://open.spotify.com/track/${state.track.id}`}>
              {state.track.name}
            </a>
          </div>
          <div className='artists-container'>
            <div
              ref={(e) => {
                handleOverflow(e);
                artistsElement.current = e;
              }}
              className='artists'>
              {Object.values(state.track.artists || []).map((props, i, arr) => (
                <>
                  <a href={props.external_urls.spotify}>{props.name}</a>
                  {arr.length - 1 !== i && ', '}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default (props: {
  store: SpotifyStore;
  fluxHooks: typeof import('replugged/common').fluxHooks;
}): React.ReactElement => {
  const [error, setError] = React.useState<unknown>();
  const [info, setInfo] = React.useState<unknown>();

  return (
    <div id='spotify-modal' className={`${error && info ? 'fallback' : ''}`}>
      <ErrorBoundary
        onError={(e: unknown, i: unknown) => {
          setError(e);
          setInfo(i);
        }}
        fallback={() => <ModalFallback />}>
        <Modal {...props} />
      </ErrorBoundary>
    </div>
  );
};
