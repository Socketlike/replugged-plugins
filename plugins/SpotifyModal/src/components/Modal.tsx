import { webpack } from 'replugged';
import { React, lodash as _ } from 'replugged/common';

import { mergeClassNames } from '@shared/dom';

import { Seekbar } from './Seekbar';
import { TrackDetails } from './TrackDetails';
import { Controls } from './Controls';

import { config } from '../config';
import { useState } from '../util/spotify';
import { events } from '../util';
import { SettingUpdates } from '../types';
import { openControlsContextMenu } from './Controls/contextMenu';

const containerClasses = await webpack.waitForModule<{
  container: string;
}>(webpack.filters.byProps('container', 'godlike'));

export const Modal = (): React.ReactElement => {
  const state = useState();

  const updateContextMenu = React.useRef<(state: SpotifyApi.CurrentPlaybackResponse) => void>();
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

    updateContextMenu.current?.(state);
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
          update: updateContextMenu,
          progress: progressRef,
          state,
        })
      }
      onMouseEnter={(): void => setShowOptionalComponents(true)}
      onMouseLeave={(): void => setShowOptionalComponents(false)}>
      <div className='main'>
        <TrackDetails track={state.item} />
        <Seekbar shouldShow={showSeekbar} progressRef={progressRef} />
        <Controls
          duration={state.item.duration_ms}
          playing={state.is_playing}
          progress={progressRef}
          shouldShow={showControls}
          repeat={state.repeat_state}
          shuffle={state.shuffle_state}
        />
      </div>
      <div className='divider' />
    </div>
  );
};
