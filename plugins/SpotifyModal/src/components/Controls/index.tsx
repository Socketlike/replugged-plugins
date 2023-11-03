import { React, lodash as _ } from 'replugged/common';

import { mergeClassNames } from '@shared/dom';

import Button from './Buttons';

import { config } from '../../config';
import { SettingUpdates } from '../../types';
import { events, logger, useControls } from '../../util';

export const ControlButtons = (props: {
  duration: number;
  playing: boolean;
  progress: React.MutableRefObject<number>;
  repeat: 'off' | 'context' | 'track';
  shouldShow: boolean;
  shuffle: boolean;
}): JSX.Element => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const { setProgress, setPlaying, setRepeat, setShuffle, skip } = useControls();

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
              <Button.PlayPause onClick={() => setPlaying(!props.playing)} state={props.playing} />
            );
          case 'repeat':
            return (
              <Button.Repeat
                onClick={() =>
                  setRepeat(
                    ({ off: 'context', context: 'track', track: 'off' } as const)[props.repeat],
                  )
                }
                state={props.repeat}
              />
            );
          case 'shuffle':
            return (
              <Button.Shuffle onClick={() => setShuffle(!props.shuffle)} state={props.shuffle} />
            );
          case 'skip-prev':
            return (
              <Button.SkipPrev
                onClick={() => {
                  if (
                    config.get('skipPreviousShouldResetProgress') &&
                    props.progress.current >=
                      props.duration * config.get('skipPreviousProgressResetThreshold')
                  )
                    setProgress(0);
                  else skip(false);
                }}
              />
            );
          case 'skip-next':
            return <Button.SkipNext onClick={() => skip(true)} />;
          default:
            return <Button.None />;
        }
      })}
    </>
  );
};

export const Controls = (props: {
  duration: number;
  playing: boolean;
  progress: React.MutableRefObject<number>;
  repeat: 'off' | 'context' | 'track';
  shouldShow: boolean;
  shuffle: boolean;
}): React.ReactElement => (
  <div className={mergeClassNames('controls-container', props.shouldShow ? '' : 'hidden')}>
    <ControlButtons {...props} />
  </div>
);

export * from './Icons';
export * from './Buttons';
