import React from 'react';

import { mergeClassNames } from '@shared/dom';

export interface IconProps {
  className?: string;
  height?: number;
  onClick?: (event: React.MouseEvent) => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  path: string;
  width?: number;
}

export const Icon = (props: IconProps): React.ReactElement => (
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
