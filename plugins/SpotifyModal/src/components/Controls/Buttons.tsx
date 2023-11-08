import { React } from 'replugged/common';

import Icons from './Icons';

export default {
  Repeat: ({
    state,
    onClick,
    disabled,
  }: {
    state: 'context' | 'track' | 'off';
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }): React.ReactElement => (
    <Icons.Repeat
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={disabled ? () => {} : onClick}
      state={state}
      disabled={disabled}
    />
  ),

  SkipPrev: ({
    onClick,
    disabled,
  }: {
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }): React.ReactElement => (
    <Icons.SkipPrev
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
    />
  ),

  PlayPause: ({
    state,
    onClick,
    disabled,
  }: {
    state: boolean;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }): React.ReactElement => (
    <Icons.PlayPause
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={disabled ? () => {} : onClick}
      state={state}
      disabled={disabled}
    />
  ),

  SkipNext: ({
    onClick,
    disabled,
  }: {
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }): React.ReactElement => (
    <Icons.SkipNext
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
    />
  ),

  Shuffle: ({
    state,
    onClick,
    disabled,
  }: {
    state: boolean;
    onClick: (e: React.MouseEvent) => void;
    disabled?: boolean;
  }): React.ReactElement => (
    <Icons.Shuffle
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={disabled ? () => {} : onClick}
      state={state}
      disabled={disabled}
    />
  ),

  None: (): React.ReactElement => (
    <Icons.None onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()} />
  ),
};
