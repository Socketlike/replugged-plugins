import React from 'react';

import { components, contextMenu } from 'replugged/common';
import { ContextMenu } from 'replugged/components';

import { MenuSliderControl as MenuSliderControlType } from '@shared/types/discord';

import { PlayPauseIcon, RepeatIcon, ShuffleIcon, SkipNextIcon, SkipPrevIcon } from './Icons';
import { config } from '../config';
import { useControls, usePlayerControlStates, useState } from '../util';

const { MenuSliderControl } = components as typeof components & {
  MenuSliderControl: MenuSliderControlType;
};

export const openControlsContextMenu = (
  ev: React.MouseEvent,
  props: {
    progress: React.MutableRefObject<number>;
    forceUpdate: React.MutableRefObject<() => void>;
  },
): void =>
  contextMenu.open(ev, (): React.ReactElement => {
    const state = useState();
    const { setProgress, setPlaying, setRepeat, setShuffle, skip, setVolume } = useControls();
    const { disallows, duration, playing, repeat, shuffle, volume } = usePlayerControlStates();

    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const destroyed = React.useRef(false);
    const isVolumeUpdating = React.useRef(false);

    React.useEffect((): (() => void) => {
      props.forceUpdate.current = () => !destroyed.current && forceUpdate();

      return () => {
        destroyed.current = true;
      };
    }, []);

    return (
      <ContextMenu.ContextMenu onClose={contextMenu.close} navId='spotify-modal-controls'>
        {!state.is_dummy && (
          <ContextMenu.MenuGroup label='Controls'>
            <ContextMenu.MenuItem label='Toggle repeat' id='repeat'>
              <ContextMenu.MenuItem
                label='Off'
                id='repeat-off'
                disabled={repeat === 'off'}
                icon={() => <RepeatIcon state='off' />}
                action={(): void => setRepeat('off')}
              />
              <ContextMenu.MenuItem
                label='All'
                id='repeat-all'
                disabled={repeat === 'context' || disallows.toggling_repeat_context}
                icon={() => <RepeatIcon state='context' />}
                action={(): void => setRepeat('context')}
              />
              <ContextMenu.MenuItem
                label='Track'
                id='repeat-track'
                disabled={repeat === 'track' || disallows.toggling_repeat_track}
                icon={() => <RepeatIcon state='track' />}
                action={(): void => setRepeat('track')}
              />
            </ContextMenu.MenuItem>
            <ContextMenu.MenuItem
              label='Skip to previous track'
              id='skip-previous'
              disabled={
                config.get('skipPreviousShouldResetProgress') &&
                config.get('skipPreviousProgressResetThreshold') * duration <=
                  props.progress.current
                  ? disallows.seeking
                  : disallows.skipping_prev
              }
              icon={() => <SkipPrevIcon />}
              action={(): void => {
                if (
                  config.get('skipPreviousShouldResetProgress') &&
                  duration * config.get('skipPreviousProgressResetThreshold') <=
                    props.progress.current &&
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
              icon={() => <PlayPauseIcon state={playing} />}
              action={(): void => setPlaying(!playing)}
            />
            <ContextMenu.MenuItem
              label='Skip to next track'
              id='skip-next'
              disabled={disallows.skipping_next}
              icon={() => <SkipNextIcon />}
              action={() => skip(true)}
            />
            <ContextMenu.MenuItem
              label={`Toggle shuffle ${shuffle ? 'off' : 'on'}`}
              id='shuffle'
              disabled={disallows.toggling_shuffle}
              icon={() => <ShuffleIcon state={!shuffle} />}
              action={(): void => setShuffle(!shuffle)}
            />
            <ContextMenu.MenuControlItem
              id='volume'
              label='Player volume'
              control={(data, ref): React.ReactElement => (
                <MenuSliderControl
                  aria-label='Player volume'
                  value={volume}
                  maxValue={100}
                  onChange={(newVolume: number): void => {
                    if (isVolumeUpdating.current) return;

                    isVolumeUpdating.current = true;

                    setVolume(Math.round(newVolume));

                    isVolumeUpdating.current = false;
                  }}
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
