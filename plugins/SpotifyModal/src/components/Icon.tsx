import { React } from 'replugged/common';

import { toClassNameString } from '../util';

export function Icon(props: {
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  path: string;
}): JSX.Element {
  return (
    <svg
      className={toClassNameString('icon', props.className)}
      viewBox='0 0 24 24'
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}>
      <path fill='currentColor' d={props.path} />
    </svg>
  );
}
