import { React, lodash as _ } from 'replugged/common';

import Button from './Buttons';
import { config } from '../../config';
import { Components, SettingUpdates } from '../../types';
import { events, toClassNameString, toggleClass } from '../../util';

export const ControlButtons = (props: Components.Props.ControlsComponent): JSX.Element => {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(
    (): VoidFunction =>
      events.on<SettingUpdates.Union>('settingsUpdate', (event): void => {
        if (event.detail.key === 'controlsLayout') {
          forceUpdate();

          events.debug('controls', ['controls layout update', _.clone(event.detail.value)]);
        }
      }),
  );

  return (
    <>
      {config.get('controlsLayout').map((kind): JSX.Element => {
        switch (kind) {
          case 'play-pause':
            return <Button.PlayPause state={props.playing} />;
          case 'repeat':
            return <Button.Repeat state={props.repeat} />;
          case 'shuffle':
            return <Button.Shuffle state={props.shuffle} />;
          case 'skip-prev':
            return <Button.SkipPrev duration={props.duration} progress={props.progress} />;
          case 'skip-next':
            return <Button.SkipNext />;
          default:
            return <Button.None />;
        }
      })}
    </>
  );
};

export const Controls = (props: Components.Props.ControlsComponent): JSX.Element => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(
    (): VoidFunction =>
      events.on<boolean>('controlsVisibility', (event): void =>
        toggleClass(containerRef.current, 'hidden', !event.detail),
      ),
    [],
  );

  return (
    <div
      ref={containerRef}
      className={toClassNameString('controls-container', props.shouldShow.current ? '' : 'hidden')}>
      <ControlButtons {...props} />
    </div>
  );
};

export * from './Icons';
export * from './Buttons';
export * from './contextMenu';
