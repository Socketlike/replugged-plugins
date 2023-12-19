import React from 'react';

import { mergeClassNames } from '@shared/dom';

export interface IconProps {
  className?: string;
  height?: string | number;
  onClick?: React.MouseEventHandler<SVGSVGElement> | boolean;
  onContextMenu?: React.MouseEventHandler<SVGSVGElement> | boolean;
  path: string;
  viewBox?: string;
  width?: string | number;
  children?: React.ReactNode;
}

export const Icon = (props: IconProps): React.ReactElement => (
  <svg
    className={mergeClassNames('icon', props.className)}
    width={props.width}
    height={props.height}
    viewBox={props.viewBox || '0 0 24 24'}
    onClick={typeof props.onClick !== 'function' ? undefined : props.onClick}
    onContextMenu={typeof props.onContextMenu !== 'function' ? undefined : props.onContextMenu}>
    <path fill='currentColor' d={props.path} />
    {props.children}
  </svg>
);
