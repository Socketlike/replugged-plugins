import React from 'react';

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

import { mergeClassNames } from '@shared/dom';

import { Icon } from '../Icon';
import { InteractableProps, InteractableWithStateProps } from '../../types';

export default {
  Repeat: ({
    onClick,
    onContextMenu,
    state,
    disabled,
  }: InteractableWithStateProps<'context' | 'track' | 'off'> & {
    disabled?: boolean;
  }): React.ReactElement => (
    <Icon
      className={mergeClassNames(
        `repeat-${state === 'context' ? 'all' : state}-icon`,
        state !== 'off' && !disabled && 'active',
        disabled && 'disabled',
      )}
      path={state === 'off' ? mdiRepeatOff : state === 'track' ? mdiRepeatOnce : mdiRepeat}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  SkipPrev: ({
    onContextMenu,
    onClick,
    disabled,
  }: InteractableProps & { disabled?: boolean }): JSX.Element => (
    <Icon
      className={mergeClassNames('skip-prev-icon', disabled && 'disabled')}
      path={mdiSkipPrevious}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  PlayPause: ({
    onClick,
    onContextMenu,
    state,
    disabled,
  }: InteractableWithStateProps<boolean> & { disabled?: boolean }): JSX.Element => (
    <Icon
      className={mergeClassNames(`${state ? 'pause' : 'play'}-icon`, disabled && 'disabled')}
      path={state ? mdiPause : mdiPlay}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  SkipNext: ({
    onClick,
    onContextMenu,
    disabled,
  }: InteractableProps & { disabled?: boolean }): JSX.Element => (
    <Icon
      className={mergeClassNames('skip-next-icon', disabled && 'disabled')}
      path={mdiSkipNext}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  Shuffle: ({
    onClick,
    onContextMenu,
    state,
    disabled,
  }: InteractableWithStateProps<boolean> & { disabled?: boolean }): JSX.Element => (
    <Icon
      className={mergeClassNames(
        `shuffle-${state ? 'on' : 'off'}-icon`,
        state && !disabled && 'active',
        disabled && 'disabled',
      )}
      path={state ? mdiShuffle : mdiShuffleDisabled}
      onContextMenu={onContextMenu}
      onClick={onClick}
    />
  ),

  None: ({ onClick, onContextMenu }: InteractableProps) => (
    <Icon className='no-icon' path='' onContextMenu={onContextMenu} onClick={onClick} />
  ),
};
