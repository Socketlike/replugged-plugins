import React from 'react';

import { mdiTranslate, mdiTranslateOff } from '@mdi/js';

import { Icon, IconProps } from '@shared/react';

export const TranslateIcon = (props?: Omit<IconProps, 'path'>): React.ReactElement => (
  <Icon {...props} path={mdiTranslate} />
);

export const TranslateOffIcon = (props?: Omit<IconProps, 'path'>): React.ReactElement => (
  <Icon {...props} path={mdiTranslateOff} />
);
