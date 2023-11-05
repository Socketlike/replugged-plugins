import { webpack } from 'replugged';
import { React, lodash as _ } from 'replugged/common';

import { mergeClassNames } from '@shared/dom';

import { Seekbar } from './Seekbar';
import { TrackDetails } from './TrackDetails';
import { Controls } from './Controls';
import { SpotifyIcon } from './Icon';

import { config } from '../config';
import { useState } from '../util/spotify';
import { events } from '../util';
import { SettingUpdates } from '../types';
import { openControlsContextMenu } from './Controls/contextMenu';

const containerClasses = await webpack.waitForModule<{
  container: string;
}>(webpack.filters.byProps('container', 'godlike'));

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

  const progressRef = React.useRef<number>(0);

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
      events.on<boolean>('showUpdate', (event) => {
        setShowModal(event.detail);
      }),
    [],
  );

  React.useEffect(() => {
    if (state.is_playing) setShowModal(true);
  }, [state]);

  React.useEffect(() =>
    events.on<SettingUpdates.Union>('settingsUpdate', (event) => {
      switch (event.detail.key) {
        case 'seekbarVisibilityState':
          setShowSeekbar(event.detail.value === 'always');
          break;

        case 'controlsVisibilityState':
          setShowControls(event.detail.value === 'always');
          break;
      }
    }),
  );

  return (
    <div
      id='spotify-modal'
      className={mergeClassNames(
        'spotify-modal',
        showModal ? '' : 'hidden',
        containerClasses.container,
      )}
      onContextMenu={(e: React.MouseEvent) =>
        openControlsContextMenu(e, {
          progress: progressRef,
        })
      }
      onMouseEnter={(): void => setShowOptionalComponents(true)}
      onMouseLeave={(): void => setShowOptionalComponents(false)}>
      <div className='main'>
        {state.isDummy ? (
          <ErrorPlaceholder
            text='Waiting for player...'
            subtext='Update your Spotify state manually if this takes too long.'
          />
        ) : (
          <>
            <TrackDetails track={state.item} />
            <Seekbar shouldShow={showSeekbar} progressRef={progressRef} />
            <Controls progress={progressRef} shouldShow={showControls} />{' '}
          </>
        )}
      </div>
      <div className='divider' />
    </div>
  );
};
