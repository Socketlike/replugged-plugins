import { webpack } from 'replugged';
import { React, contextMenu } from 'replugged/common';
import { ContextMenu } from 'replugged/components';

import { MenuSliderControl as MenuSliderControlType } from '@shared/types/discord';

import Icon from './Icons';

import { config } from '../../config';
import { useControls, usePlayerControlStates, useState } from '../../util';

const { MenuSliderControl } = await webpack.waitForModule<{
  MenuSliderControl: MenuSliderControlType;
}>(webpack.filters.byProps('Slider', 'Spinner'));

export const openControlsContextMenu = (
  ev: React.MouseEvent,
  props: {
    progress: React.MutableRefObject<number>;
  },
): void =>
  contextMenu.open(ev, (): JSX.Element => {
    const state = useState();
    const { setProgress, setPlaying, setRepeat, setShuffle, skip, setVolume } = useControls();
    const { disallows, duration, playing, repeat, shuffle, volume } = usePlayerControlStates();

    return (
      <ContextMenu.ContextMenu onClose={contextMenu.close} navId='spotify-modal-controls'>
        {!state.isDummy && (
          <ContextMenu.MenuGroup label='Controls'>
            <ContextMenu.MenuItem label='Toggle repeat' id='repeat'>
              <ContextMenu.MenuItem
                label='Off'
                id='repeat-off'
                disabled={repeat === 'off'}
                icon={() => <Icon.Repeat state='off' />}
                action={(): void => setRepeat('off')}
              />
              <ContextMenu.MenuItem
                label='All'
                id='repeat-all'
                disabled={repeat === 'context' || disallows.toggling_repeat_context}
                icon={() => <Icon.Repeat state='context' />}
                action={(): void => setRepeat('context')}
              />
              <ContextMenu.MenuItem
                label='Track'
                id='repeat-track'
                disabled={repeat === 'track' || disallows.toggling_repeat_track}
                icon={() => <Icon.Repeat state='track' />}
                action={(): void => setRepeat('track')}
              />
            </ContextMenu.MenuItem>
            <ContextMenu.MenuItem
              label='Skip to previous track'
              id='skip-previous'
              disabled={
                !config.get('skipPreviousShouldResetProgress')
                  ? disallows.skipping_prev
                  : disallows.skipping_prev && disallows.seeking
              }
              icon={() => <Icon.SkipPrev />}
              action={(): void => {
                if (
                  config.get('skipPreviousShouldResetProgress') &&
                  props.progress.current >=
                    duration * config.get('skipPreviousProgressResetThreshold') &&
                  !disallows.seeking
                )
                  setProgress(0);
                else if (!disallows.skipping_prev) skip(false);
              }}
            />
            <ContextMenu.MenuItem
              label={`${playing ? 'Pause' : 'Resume'} playback`}
              id='play-pause'
              disabled={playing ? disallows.pausing : disallows.resuming}
              icon={() => <Icon.PlayPause state={playing} />}
              action={(): void => setPlaying(!playing)}
            />
            <ContextMenu.MenuItem
              label='Skip to next track'
              id='skip-next'
              disabled={disallows.skipping_next}
              icon={() => <Icon.SkipNext />}
              action={() => skip(true)}
            />
            <ContextMenu.MenuItem
              label={`Toggle shuffle ${shuffle ? 'off' : 'on'}`}
              id='shuffle'
              disabled={disallows.toggling_shuffle}
              icon={() => <Icon.Shuffle state={!shuffle} />}
              action={(): void => setShuffle(shuffle)}
            />
            <ContextMenu.MenuControlItem
              id='volume'
              label='Player volume'
              control={(data, ref): JSX.Element => (
                <MenuSliderControl
                  aria-label='Player volume'
                  value={volume}
                  maxValue={100}
                  onChange={(newVolume: number): void => setVolume(Math.round(newVolume))}
                  {...data}
                  ref={ref}
                />
              )}
            />
          </ContextMenu.MenuGroup>
        )}
      </ContextMenu.ContextMenu>
    );
  });
