import { webpack } from 'replugged';
import { React, contextMenu } from 'replugged/common';
import { ContextMenu } from 'replugged/components';

import { MenuSliderControl as MenuSliderControlType } from '@shared/types/discord';

import Icon from './Icons';

import { config } from '../../config';
import { useControls } from '../../util';

const { MenuSliderControl } = await webpack.waitForModule<{
  MenuSliderControl: MenuSliderControlType;
}>(webpack.filters.byProps('Slider', 'Spinner'));

export const openControlsContextMenu = (
  ev: React.MouseEvent,
  props: {
    update: React.MutableRefObject<(state: SpotifyApi.CurrentPlaybackResponse) => void>;
    state: SpotifyApi.CurrentPlaybackResponse;
    progress: React.MutableRefObject<number>;
  },
): void =>
  contextMenu.open(ev, (): JSX.Element => {
    const [state, setState] = React.useState(props.state);
    const { setProgress, setPlaying, setRepeat, setShuffle, skip, setVolume } = useControls();
    const destroyed = React.useRef<boolean>(false);

    React.useEffect((): VoidFunction => {
      props.update.current = (state: SpotifyApi.CurrentPlaybackResponse): void => {
        if (!destroyed.current) setState(state);
      };

      return (): void => {
        destroyed.current = true;
      };
    }, []);

    return (
      <ContextMenu.ContextMenu onClose={contextMenu.close} navId='spotify-modal-controls'>
        <ContextMenu.MenuGroup label='Controls'>
          <ContextMenu.MenuItem label='Toggle repeat' id='repeat'>
            <ContextMenu.MenuItem
              label='Off'
              id='repeat-off'
              disabled={state.repeat_state === 'off'}
              icon={() => <Icon.Repeat state='off' />}
              action={(): void => setRepeat('off')}
            />
            <ContextMenu.MenuItem
              label='All'
              id='repeat-all'
              disabled={state.repeat_state === 'context'}
              icon={() => <Icon.Repeat state='context' />}
              action={(): void => setRepeat('context')}
            />
            <ContextMenu.MenuItem
              label='Track'
              id='repeat-track'
              disabled={state.repeat_state === 'track'}
              icon={() => <Icon.Repeat state='track' />}
              action={(): void => setRepeat('track')}
            />
          </ContextMenu.MenuItem>
          <ContextMenu.MenuItem
            label='Skip to previous track'
            id='skip-previous'
            icon={() => <Icon.SkipPrev />}
            action={(): void => {
              if (
                config.get('skipPreviousShouldResetProgress') &&
                props.progress.current >=
                  (state.item?.duration_ms || Infinity) *
                    config.get('skipPreviousProgressResetThreshold')
              )
                setProgress(0);
              else skip(false);
            }}
          />
          <ContextMenu.MenuItem
            label={`${state.is_playing ? 'Pause' : 'Resume'} playback`}
            id='play-pause'
            icon={() => <Icon.PlayPause state={state.is_playing} />}
            action={(): void => setPlaying(!state.is_playing)}
          />
          <ContextMenu.MenuItem
            label='Skip to next track'
            id='skip-next'
            icon={() => <Icon.SkipNext />}
            action={() => skip(true)}
          />
          <ContextMenu.MenuItem
            label={`Toggle shuffle ${state.shuffle_state ? 'off' : 'on'}`}
            id='shuffle'
            icon={() => <Icon.Shuffle state={!state.shuffle_state} />}
            action={(): void => setShuffle(state.shuffle_state)}
          />
          <ContextMenu.MenuControlItem
            id='volume'
            label='Player volume'
            control={(data, ref): JSX.Element => (
              <MenuSliderControl
                aria-label='Player volume'
                value={state.device.volume_percent}
                maxValue={100}
                onChange={(newVolume: number): void => setVolume(Math.round(newVolume))}
                {...data}
                ref={ref}
              />
            )}
          />
        </ContextMenu.MenuGroup>
      </ContextMenu.ContextMenu>
    );
  });
