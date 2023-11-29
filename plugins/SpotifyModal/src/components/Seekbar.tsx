import React from 'react';

import { Slider } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';

import { parseTime, useControls, usePlayerControlStates } from '../util';

export const Seekbar = (props: { shouldShow: boolean; progress: number }): React.ReactElement => {
  const { setProgress } = useControls();

  const isSliderChanging = React.useRef<boolean>(false);
  const isUpdating = React.useRef<boolean>(false);

  const { disallows, duration, timestamp } = usePlayerControlStates();
  const [seekingProgress, setSeekingProgress] = React.useState(0);

  // reset seeking progress on new state
  React.useEffect((): void => setSeekingProgress(0), [timestamp]);

  return (
    <div className={mergeClassNames('seekbar-container', !props.shouldShow ? 'hidden' : '')}>
      <div className='seekbar-timestamps'>
        <span className='progress'>
          {parseTime(isSliderChanging.current ? seekingProgress : props.progress)}
        </span>
        <span className='duration'>{parseTime(duration)}</span>
      </div>
      <Slider
        className='seekbar'
        barClassName='inner'
        grabberClassName='grabber'
        mini={true}
        minValue={0}
        maxValue={duration}
        value={!isSliderChanging.current ? props.progress : seekingProgress}
        disabled={disallows.seeking}
        asValueChanges={(value: number): void => {
          if (!isSliderChanging.current) isSliderChanging.current = true;
          setSeekingProgress(value);
        }}
        onChange={(newValue: number): void => {
          if (isUpdating.current) return;

          isUpdating.current = true;

          setProgress(Math.round(newValue));

          isUpdating.current = false;
          isSliderChanging.current = false;
        }}
        onValueRender={parseTime}
      />
    </div>
  );
};
