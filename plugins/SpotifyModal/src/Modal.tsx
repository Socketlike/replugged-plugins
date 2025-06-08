import React from 'react';
import { Logger } from 'replugged';
import { fluxHooks, toast } from 'replugged/common';
import { ErrorBoundary, SliderItem, Tooltip } from 'replugged/components';

import { ConnectedAccount, ConnectedAccountsUtils, SpotifyStore } from './types';
import { useConfig } from './config';
import * as utils from './utils';

const log = Logger.plugin('SpotifyModal', '#1DB954');

function formatTimestamp(timestamp: number): string {
  let seconds = Math.floor(timestamp / 1000);
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return `${hours ? `${hours}:` : ''}${String(minutes).padStart(hours ? 2 : 1, '0')}:${String(seconds).padStart(2, '0')}`;
}

function handleOverflow(element: HTMLElement, parentLevel = 1): void {
  if (!element) return;

  let parent = element;
  for (let i = 0; i < parentLevel; i++) parent = parent?.parentElement;

  if (!parent || parent === element) return;

  if (element.scrollWidth > parent.clientWidth) {
    // 60px/s
    element.style.animationDuration = `${(element.scrollWidth / 45) * 1.1}s`;
    element.style.animationDelay = `-${(element.scrollWidth / 45) * 1.1 * 0.449}s`;
    element.classList.add('overflow');
  } else element.classList.remove('overflow');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useInterval = (callback: (...args: any[]) => void, delay: number): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedCallback = React.useRef<(...args: any[]) => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (delay !== null) {
      let id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const ModalFallback = (): React.ReactElement => (
  <>uh oh. something went wrong while rendering the modal.</>
);

export const TrackDetails = (props: {
  state: ReturnType<SpotifyStore['getPlayerState']>;
}): React.ReactElement => {
  const { state } = props;

  const trackNameElement = React.useRef<HTMLAnchorElement>();
  const artistsElement = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    handleOverflow(trackNameElement.current, 2);
    handleOverflow(artistsElement.current, 2);
  }, [state]);

  return (
    <div className='track-details details'>
      <Tooltip shouldShow={Boolean(state.track.album?.name)} text={state.track.album?.name || ''}>
        <span className='cover-art-container'>
          <img className='cover-art' src={state.track.album?.image?.url} />
        </span>
      </Tooltip>
      <div className='container'>
        <div className='track-name-container'>
          <Tooltip
            shouldShow={Boolean(state.track.name)}
            style={{ display: 'inline-block' }}
            text={state.track.name || ''}>
            <a
              ref={(e) => {
                handleOverflow(e, 2);
                trackNameElement.current = e;
              }}
              className='track-name'
              href={state.track.id && `https://open.spotify.com/track/${state.track.id}`}>
              {state.track.name}
            </a>
          </Tooltip>
        </div>

        <div className='artists-container'>
          <Tooltip
            shouldShow={Boolean(state.track.artists?.length)}
            style={{ display: 'inline-block' }}
            text={Object.values(state.track.artists || [])
              .map((props) => props.name)
              .join(', ')}>
            <div
              ref={(e) => {
                handleOverflow(e, 2);
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
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export const Seekbar = (props: {
  account: ConnectedAccount;
  connectedAccountsUtils: ConnectedAccountsUtils;
  start: number;
  end: number;
  paused: boolean;
  active: boolean;
}): React.ReactNode => {
  const { account, connectedAccountsUtils, start, end, paused, active } = props;

  const enabled = useConfig('seekbar.enabled', true);
  const collapseOnBlur = useConfig('seekbar.collapseOnBlur', false);

  const [current, setCurrent] = React.useState(0);
  const ref = React.useRef<{ setState(props: { value: number }): void }>();

  const isSeeking = React.useRef(false);

  useInterval(() => {
    if (!active || paused || isSeeking.current) return;

    setCurrent(Math.min(Date.now() - start, end));
  }, 500);

  // discord's sliders are no longer dumb, which means they won't react to prop changes
  // after first render so we need to set its state manually
  React.useEffect(() => {
    ref.current?.setState?.({ value: current });
  }, [current]);

  return (
    <div
      className={utils.classNameFactory({
        'seekbar-container': true,
        enabled,
        'collapse-on-blur': collapseOnBlur,
      })}>
      <div className='timestamps'>
        <span>{formatTimestamp(current)}</span>
        <span>{formatTimestamp(end)}</span>
      </div>
      <SliderItem
        // @ts-expect-error - ref can be used here
        ref={ref}
        className='seekbar'
        barClassName='bar'
        style={{ margin: 0 }}
        mini
        maxValue={end}
        value={current}
        minValue={0}
        onValueRender={formatTimestamp}
        asValueChanges={(v) => {
          if (!isSeeking.current) isSeeking.current = true;

          setCurrent(v);
        }}
        onChange={(v) => {
          void utils.spotify.seekTo(account?.accessToken, v).then(async (res) => {
            if (res === 0)
              toast.toast(
                '[SpotifyModal] Internal plugin error. Please check console.',
                toast.Kind.FAILURE,
              );
            else if (res === 401) {
              const newToken = await connectedAccountsUtils
                .refreshAccountToken('spotify', account.id)
                .catch(() => {});

              if (!newToken)
                toast.toast(
                  '[SpotifyModal] Authentication error: Could not refresh expired token. Please perform this action in your Spotify player.',
                  toast.Kind.FAILURE,
                );
              else {
                res = await utils.spotify.seekTo(newToken, v);

                if (res === 401)
                  toast.toast(
                    '[SpotifyModal] Authentication error: Could not refresh expired token. Please perform this action in your Spotify player.',
                    toast.Kind.FAILURE,
                  );
                else if (res !== 200 && res !== 204) {
                  log.error("couldn't resume action after refreshing token; code", res);

                  toast.toast(
                    '[SpotifyModal] Resuming action after reauthentication errored. Please check console.',
                    toast.Kind.FAILURE,
                  );
                }
              }
            } else if (res === 404)
              toast.toast(
                '[SpotifyModal] Player is idle and cannot be accessed. Please perform this action in your Spotify player.',
                toast.Kind.FAILURE,
              );
            else if (res === 403)
              toast.toast(
                '[SpotifyModal] Bad OAuth request. The Spotify account was probably unlinked from your Discord account.',
                toast.Kind.FAILURE,
              );
            else if (res === 429)
              toast.toast(
                '[SpotifyModal] Too many requests. Please slow down.',
                toast.Kind.FAILURE,
              );

            isSeeking.current = false;
          });
        }}
      />
    </div>
  );
};

export const Modal = (props: {
  store: SpotifyStore;
  connectedAccountsUtils: ConnectedAccountsUtils;
}): React.ReactElement => {
  const { connectedAccountsUtils, store } = props;

  const [state, setState] = React.useState<ReturnType<typeof store.getPlayerState>>();
  const [activity, setActivity] = React.useState<ReturnType<typeof store.getActivity>>();
  const [active, setActive] = React.useState(false);
  const [paused, setPaused] = React.useState(true);

  const _socket = fluxHooks.useStateFromStores([store], () => {
    const socket = store.getActiveSocketAndDevice()?.socket;
    const _state = store.getPlayerState(socket?.accountId);
    const _active = Boolean(socket);
    const _activity = store.getActivity();

    if (active !== _active) {
      log.log('active state update', _active);
      setActive(_active);
    }

    if ((!socket || _active) && state !== _state) {
      if (_state) {
        log.log('player state update', _state);
        setState(_state);
      }

      if (_activity) {
        log.log('activity update', _activity);
        setActivity(_activity);
      }

      if (paused !== !_state) setPaused(!_state);
    }

    return socket;
  });

  return active && state ? (
    <>
      <TrackDetails state={state} />
      <Seekbar
        account={state.account}
        connectedAccountsUtils={connectedAccountsUtils}
        start={activity?.timestamps?.start || 0}
        end={state?.track?.duration || 1}
        paused={paused}
        active={active}
      />
    </>
  ) : (
    <></>
  );
};

export default (props: {
  store: SpotifyStore;
  connectedAccountsUtils: ConnectedAccountsUtils;
}): React.ReactElement => {
  const [error, setError] = React.useState<unknown>();
  const [info, setInfo] = React.useState<unknown>();

  const reduceMotion = useConfig('general.reduceMotion', 'discord');

  return (
    <div
      id='spotify-modal'
      className={utils.classNameFactory({
        fallback: Boolean(error && info),
        'use-discord-reduce-motion': reduceMotion === 'discord',
        'reduce-motion': reduceMotion !== 'discord' && reduceMotion,
      })}>
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
