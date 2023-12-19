import React from 'react';

import { lodash as _ } from 'replugged/common';

import { mergeClassNames } from '@shared/dom';
import { useInterval } from '@shared/react';

import { Seekbar } from './Seekbar';
import { TrackDetails } from './TrackDetails';
import { Controls } from './Controls';
import { openControlsContextMenu } from './ControlContextMenu';
import { SpotifyIcon } from './Icons';

import { config } from '../config';
import {
  containerClasses,
  globalEvents,
  useActiveAccountId,
  usePlayerControlStates,
  useState,
} from '../util';

export const ErrorPlaceholder = (props: {
  text?: string;
  subtext?: string;
}): React.ReactElement => (
  <div className='placeholder'>
    <SpotifyIcon className='spotify' />
    {(props?.text || props?.subtext) && (
      <div className='text'>
        {props?.text && <span className='main'>{props?.text}</span>}
        {props?.subtext && <span className='sub'>{props?.subtext}</span>}
      </div>
    )}
  </div>
);

export const Modal = (): React.ReactElement => {
  const state = useState();
  const activeAccountId = useActiveAccountId();
  const { playing, progress, timestamp, duration } = usePlayerControlStates();

  const [realProgress, setRealProgress] = React.useState(0);
  const progressRef = React.useRef(0);
  const forceUpdateContextMenuRef = React.useRef(() => {});

  const [showModal, setShowModal] = React.useState(false);
  const [showSeekbar, setShowSeekbar] = React.useState(
    config.get('seekbarVisibilityState') === 'always',
  );
  const [showControls, setShowControls] = React.useState(
    config.get('controlsVisibilityState') === 'always',
  );
  const setShowOptionalComponents = React.useCallback((state: boolean): void => {
    if (config.get('seekbarVisibilityState') === 'auto') setShowSeekbar(state);
    if (config.get('controlsVisibilityState') === 'auto') setShowControls(state);
  }, []);

  React.useEffect(
    () =>
      globalEvents.on('showUpdate', (event) => {
        setShowModal(event.detail);
      }),
    [],
  );

  React.useEffect(() => {
    if (state.is_playing) setShowModal(true);
  }, [state]);

  React.useEffect(
    () =>
      globalEvents.on('settingsUpdate', (event) => {
        switch (event.detail.key) {
          case 'seekbarVisibilityState':
            setShowSeekbar(event.detail.value === 'always');
            break;

          case 'controlsVisibilityState':
            setShowControls(event.detail.value === 'always');
            break;
        }
      }),
    [],
  );

  useInterval(() => {
    const now = Date.now();
    let nowProgress: number;

    if (!playing) nowProgress = progress;
    else if (now + progress < timestamp + duration) nowProgress = now + progress - timestamp;
    else if (nowProgress !== duration) nowProgress = duration;

    setRealProgress(nowProgress);

    progressRef.current = nowProgress;

    forceUpdateContextMenuRef?.current?.();
  }, 1000);

  return (
    <div
      id='spotify-modal'
      className={mergeClassNames(
        'spotify-modal',
        showModal ? '' : 'hidden',
        containerClasses?.container,
      )}
      onContextMenu={(e: React.MouseEvent) =>
        openControlsContextMenu(e, {
          progress: progressRef,
          forceUpdate: forceUpdateContextMenuRef,
        })
      }
      onMouseEnter={(): void => setShowOptionalComponents(true)}
      onMouseLeave={(): void => setShowOptionalComponents(false)}>
      <div className='main'>
        {state.is_dummy || !showModal || !activeAccountId ? (
          <ErrorPlaceholder
            text='Waiting for player...'
            subtext='Update your Spotify state manually if this takes too long.'
          />
        ) : (
          <>
            <TrackDetails track={state.item} />
            <Seekbar shouldShow={showSeekbar} progress={realProgress} />
            <Controls progress={realProgress} shouldShow={showControls} />
          </>
        )}
      </div>
      <div className='divider' />
    </div>
  );
};
