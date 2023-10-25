import { React } from 'replugged/common';

import Icons from './Icons';
import { emitPlayPause, emitRepeat, emitShuffle, emitSkipNext, emitSkipPrev } from './util';

export default {
  Repeat: ({ state }: { state: 'context' | 'track' | 'off' }): JSX.Element => {
    const nextState = React.useMemo((): 'off' | 'context' | 'track' => {
      if (state === 'off') return 'context';
      else if (state === 'context') return 'track';
      else return 'off';
    }, [state]);

    return (
      <Icons.Repeat
        onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
        onClick={(e: React.MouseEvent): void => emitRepeat(e, state, nextState)}
        state={state}
      />
    );
  },

  SkipPrev: ({
    duration,
    progress,
  }: {
    duration: number;
    progress: React.MutableRefObject<number>;
  }): JSX.Element => (
    <Icons.SkipPrev
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={(e: React.MouseEvent): void => emitSkipPrev(e, duration, progress.current)}
    />
  ),

  PlayPause: ({ state }: { state: boolean }): JSX.Element => (
    <Icons.PlayPause
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={(e: React.MouseEvent): void => emitPlayPause(e, state)}
      state={state}
    />
  ),

  SkipNext: (): JSX.Element => (
    <Icons.SkipNext
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={(e: React.MouseEvent): void => emitSkipNext(e)}
    />
  ),

  Shuffle: ({ state }: { state: boolean }) => (
    <Icons.Shuffle
      onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()}
      onClick={(e: React.MouseEvent): void => emitShuffle(e, state)}
      state={state}
    />
  ),

  None: (): JSX.Element => (
    <Icons.None onContextMenu={(e: React.MouseEvent): void => e.stopPropagation()} />
  ),
};
