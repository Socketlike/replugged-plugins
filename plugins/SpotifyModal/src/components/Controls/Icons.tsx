import { React } from 'replugged/common';

import {
  mdiPause,
  mdiPlay,
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiShuffle,
  mdiShuffleDisabled,
  mdiSkipNext,
  mdiSkipPrevious,
} from '@mdi/js';

import { toClassNameString } from '../../util';
import { Icon } from '../Icon';
import { Components } from '../../types';

export default {
  Repeat: ({
    onClick,
    onContextMenu,
    state,
  }: Components.Props.InteractableWithState<'context' | 'track' | 'off'>): JSX.Element => (
    <Icon
      className={toClassNameString(
        `repeat-${state === 'context' ? 'all' : state}-icon`,
        state !== 'off' ? 'active' : '',
      )}
      path={state === 'off' ? mdiRepeatOff : state === 'track' ? mdiRepeatOnce : mdiRepeat}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  SkipPrev: ({ onContextMenu, onClick }: Components.Props.Interactable): JSX.Element => (
    <Icon
      className='skip-prev-icon'
      path={mdiSkipPrevious}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  PlayPause: ({
    onClick,
    onContextMenu,
    state,
  }: Components.Props.InteractableWithState<boolean>): JSX.Element => (
    <Icon
      className={`${state ? 'pause' : 'play'}-icon`}
      path={state ? mdiPause : mdiPlay}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  SkipNext: ({ onClick, onContextMenu }: Components.Props.Interactable): JSX.Element => (
    <Icon
      className='skip-next-icon'
      path={mdiSkipNext}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  Shuffle: ({
    onClick,
    onContextMenu,
    state,
  }: Components.Props.InteractableWithState<boolean>): JSX.Element => (
    <Icon
      className={toClassNameString(`shuffle-${state ? 'on' : 'off'}-icon`, state ? 'active' : '')}
      path={state ? mdiShuffle : mdiShuffleDisabled}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  None: ({ onClick, onContextMenu }: Components.Props.Interactable) => (
    <Icon className='no-icon' path='' onContextMenu={onContextMenu} onClick={onClick} />
  ),
};
