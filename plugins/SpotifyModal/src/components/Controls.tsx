import React from 'react';

import { lodash as _ } from 'replugged/common';

import { mergeClassNames } from '@shared/dom';

import {
  NoButton,
  PlayPauseButton,
  RepeatButton,
  ShuffleButton,
  SkipNextButton,
  SkipPrevButton,
} from './Buttons';

import { config } from '../config';
import { globalEvents, logger, useControls, usePlayerControlStates } from '../util';

const nextRepeatStates = {
  normal: { off: 'context', context: 'track', track: 'off' },
  noContext: { off: 'track', context: 'off', track: 'off' },
  noTrack: { off: 'context', context: 'off', track: 'off' },
} as const;

export const ControlButtons = (props: { progress: number }): React.ReactElement => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const { setProgress, setPlaying, setRepeat, setShuffle, skip } = useControls();
  const { disallows, duration, playing, repeat, shuffle } = usePlayerControlStates();

  React.useEffect(
    () =>
      globalEvents.on('settingsUpdate', (event): void => {
        if (event.detail.key === 'controlsLayout') {
          forceUpdate();
          logger.log('(controls)', 'controls layout update', _.clone(event.detail.value));
        }
      }),
    [],
  );

  return (
    <>
      {config
        .get('controlsLayout')
        .slice(0, 5)
        .map((kind): React.ReactElement => {
          switch (kind) {
            case 'play-pause':
              return (
                <PlayPauseButton
                  onClick={() => setPlaying(!playing)}
                  state={playing}
                  disabled={playing ? disallows.pausing : disallows.resuming}
                />
              );

            case 'repeat':
              return (
                <RepeatButton
                  onClick={() => {
                    if (disallows.toggling_repeat_context)
                      setRepeat(nextRepeatStates.noContext[repeat]);
                    else if (disallows.toggling_repeat_track)
                      setRepeat(nextRepeatStates.noTrack[repeat]);
                    else setRepeat(nextRepeatStates.normal[repeat]);
                  }}
                  state={repeat}
                  disabled={disallows.toggling_repeat_context && disallows.toggling_repeat_track}
                />
              );

            case 'shuffle':
              return (
                <ShuffleButton
                  onClick={() => setShuffle(!shuffle)}
                  state={shuffle}
                  disabled={disallows.toggling_shuffle}
                />
              );

            case 'skip-prev':
              return (
                <SkipPrevButton
                  onClick={() => {
                    if (
                      config.get('skipPreviousShouldResetProgress') &&
                      config.get('skipPreviousProgressResetThreshold') * duration <=
                        props.progress &&
                      !disallows.seeking
                    )
                      setProgress(0);
                    else if (!disallows.skipping_prev) skip(false);
                  }}
                  disabled={
                    config.get('skipPreviousShouldResetProgress') &&
                    config.get('skipPreviousProgressResetThreshold') * duration <= props.progress
                      ? disallows.seeking
                      : disallows.skipping_prev
                  }
                />
              );

            case 'skip-next':
              return (
                <SkipNextButton onClick={() => skip(true)} disabled={disallows.skipping_next} />
              );

            default:
              return <NoButton />;
          }
        })}
    </>
  );
};

export const Controls = (props: { progress: number; shouldShow: boolean }): React.ReactElement => (
  <div className={mergeClassNames('controls-container', props.shouldShow ? '' : 'hidden')}>
    <ControlButtons {...props} />
  </div>
);
