import { React } from 'replugged/common';
import { Slider } from 'replugged/components';

import { useInterval } from '@shared/react';
import { mergeClassNames } from '@shared/dom';

import { parseTime, useControls, usePlayerControlStates } from '../util';

export const Seekbar = (props: {
  shouldShow: boolean;
  progressRef: React.MutableRefObject<number>;
}): JSX.Element => {
  const { setProgress } = useControls();

  const isSliderChanging = React.useRef<boolean>(false);
  const isUpdating = React.useRef<boolean>(false);

  const { disallows, duration, progress, playing, timestamp } = usePlayerControlStates();
  const [realProgress, setRealProgress] = React.useState(progress);
  const [seekingProgress, setSeekingProgress] = React.useState(0);

  useInterval(() => {
    const now = Date.now();
    let nowProgress: number;

    if (!playing) nowProgress = progress;
    else if (now + progress < timestamp + duration) nowProgress = now + progress - timestamp;
    else if (nowProgress !== duration) nowProgress = duration;

    if (!isSliderChanging.current) setRealProgress(nowProgress);

    props.progressRef.current = nowProgress;
  }, 1000);

  // reset seeking progress on new state
  React.useEffect((): void => setSeekingProgress(0), [timestamp]);

  return (
    <div className={mergeClassNames('seekbar-container', !props.shouldShow ? 'hidden' : '')}>
      <div className='seekbar-timestamps'>
        <span className='progress'>
          {parseTime(isSliderChanging.current ? seekingProgress : realProgress)}
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
        value={realProgress}
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
