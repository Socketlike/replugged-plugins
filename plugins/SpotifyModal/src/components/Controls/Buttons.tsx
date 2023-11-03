import { React } from 'replugged/common';

import Icons from './Icons';

export default {
  Repeat: ({
    state,
    onClick,
  }: {
    state: 'context' | 'track' | 'off';
    onClick: (e: React.MouseEvent) => void;
  }): React.ReactElement => (
    <Icons.Repeat
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={onClick}
      state={state}
    />
  ),

  SkipPrev: ({ onClick }: { onClick: (e: React.MouseEvent) => void }): React.ReactElement => (
    <Icons.SkipPrev
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={onClick}
    />
  ),

  PlayPause: ({
    state,
    onClick,
  }: {
    state: boolean;
    onClick: (e: React.MouseEvent) => void;
  }): React.ReactElement => (
    <Icons.PlayPause
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={onClick}
      state={state}
    />
  ),

  SkipNext: ({ onClick }: { onClick: (e: React.MouseEvent) => void }): React.ReactElement => (
    <Icons.SkipNext
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={onClick}
    />
  ),

  Shuffle: ({
    state,
    onClick,
  }: {
    state: boolean;
    onClick: (e: React.MouseEvent) => void;
  }): React.ReactElement => (
    <Icons.Shuffle
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={onClick}
      state={state}
    />
  ),

  None: (): React.ReactElement => (
    <Icons.None onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()} />
  ),
};
