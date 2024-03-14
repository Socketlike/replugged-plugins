import React from 'react';

import { IconProps } from '@shared/react';

import {
  ExpandCollapseIcon,
  NoIcon,
  PlayPauseIcon,
  RepeatIcon,
  ShuffleIcon,
  SkipNextIcon,
  SkipPrevIcon,
} from './Icons';

export const RepeatButton = ({
  state,
  onClick,
  disabled,
}: Pick<IconProps, 'onClick'> & {
  state: 'context' | 'track' | 'off';
  disabled?: boolean;
}): React.ReactElement => (
  <RepeatIcon
    onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
    onClick={!disabled && onClick}
    state={state}
    disabled={disabled}
  />
);

export const SkipPrevButton = ({
  onClick,
  disabled,
}: Pick<IconProps, 'onClick'> & {
  disabled?: boolean;
}): React.ReactElement => (
  <SkipPrevIcon
    onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
    onClick={!disabled && onClick}
    disabled={disabled}
  />
);
export const PlayPauseButton = ({
  state,
  onClick,
  disabled,
}: Pick<IconProps, 'onClick'> & {
  state: boolean;
  disabled?: boolean;
}): React.ReactElement => (
  <PlayPauseIcon
    onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
    onClick={!disabled && onClick}
    state={state}
    disabled={disabled}
  />
);
export const SkipNextButton = ({
  onClick,
  disabled,
}: Pick<IconProps, 'onClick'> & {
  disabled?: boolean;
}): React.ReactElement => (
  <SkipNextIcon
    onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
    onClick={!disabled && onClick}
    disabled={disabled}
  />
);

export const ShuffleButton = ({
  state,
  onClick,
  disabled,
}: Pick<IconProps, 'onClick'> & {
  state: boolean;
  disabled?: boolean;
}): React.ReactElement => (
  <ShuffleIcon
    onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
    onClick={!disabled && onClick}
    state={state}
    disabled={disabled}
  />
);

export const ExpandCollapseButton = ({
  state,
  onClick,
  disabled,
}: Pick<IconProps, 'onClick'> & {
  state: boolean;
  disabled?: boolean;
}): React.ReactElement => (
  <ExpandCollapseIcon
    onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
    onClick={!disabled && onClick}
    state={state}
    disabled={disabled}
  />
);

export const NoButton = (): React.ReactElement => (
  <NoIcon onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()} />
);
