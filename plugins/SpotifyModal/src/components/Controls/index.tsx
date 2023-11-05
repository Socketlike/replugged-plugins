import { React, lodash as _ } from 'replugged/common';

import { mergeClassNames } from '@shared/dom';

import Button from './Buttons';

import { config } from '../../config';
import { SettingUpdates } from '../../types';
import { events, logger, useControls, usePlayerControlStates } from '../../util';

const nextRepeatStates = {
  normal: { off: 'context', context: 'track', track: 'off' },
  noContext: { off: 'track', context: 'off', track: 'off' },
  noTrack: { off: 'context', context: 'off', track: 'off' },
} as const;

export const ControlButtons = (props: {
  progress: React.MutableRefObject<number>;
}): JSX.Element => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const { setProgress, setPlaying, setRepeat, setShuffle, skip } = useControls();
  const { disallows, duration, playing, repeat, shuffle } = usePlayerControlStates();

  React.useEffect(() =>
    events.on<SettingUpdates.Union>('settingsUpdate', (event): void => {
      if (event.detail.key === 'controlsLayout') {
        forceUpdate();

        logger.log('(controls)', 'controls layout update', _.clone(event.detail.value));
      }
    }),
  );

  return (
    <>
      {config.get('controlsLayout').map((kind): JSX.Element => {
        switch (kind) {
          case 'play-pause':
            return (
              <Button.PlayPause
                onClick={() =>
                  (playing ? !disallows.pausing : !disallows.resuming) && setPlaying(!playing)
                }
                state={playing}
                disabled={playing ? disallows.pausing : disallows.resuming}
              />
            );
          case 'repeat':
            return (
              <Button.Repeat
                onClick={() => {
                  if (disallows.toggling_repeat_context && disallows.toggling_repeat_track) return;

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
              <Button.Shuffle
                onClick={() => !disallows.toggling_shuffle && setShuffle(!shuffle)}
                state={shuffle}
                disabled={disallows.toggling_shuffle}
              />
            );
          case 'skip-prev':
            return (
              <Button.SkipPrev
                onClick={() => {
                  if (
                    config.get('skipPreviousShouldResetProgress') &&
                    props.progress.current >=
                      duration * config.get('skipPreviousProgressResetThreshold') &&
                    !disallows.seeking
                  )
                    setProgress(0);
                  else if (!disallows.skipping_prev) skip(false);
                }}
                disabled={disallows.skipping_prev && disallows.seeking}
              />
            );
          case 'skip-next':
            return (
              <Button.SkipNext
                onClick={() => !disallows.skipping_next && skip(true)}
                disabled={disallows.skipping_next}
              />
            );
          default:
            return <Button.None />;
        }
      })}
    </>
  );
};

export const Controls = (props: {
  progress: React.MutableRefObject<number>;
  shouldShow: boolean;
}): React.ReactElement => (
  <div className={mergeClassNames('controls-container', props.shouldShow ? '' : 'hidden')}>
    <ControlButtons {...props} />
  </div>
);

export * from './Icons';
export * from './Buttons';
