import React from 'react';

import { mergeClassNames } from '@shared/dom';

export const Icon = (props: {
  className?: string;
  width?: number;
  height?: number;
  onClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  path: string;
}): React.ReactElement => (
  <svg
    className={mergeClassNames('icon', props.className)}
    width={props.width}
    height={props.height}
    viewBox='0 0 24 24'
    onClick={props.onClick}
    onContextMenu={props.onContextMenu}>
    <path fill='currentColor' d={props.path} />
  </svg>
);
