import React from 'react';

import { mdiTranslate } from '@mdi/js';

import { Icon, IconProps } from '@shared/react';

export const TranslateIcon = (props?: Omit<IconProps, 'path'>): React.ReactElement => (
  <Icon {...props} path={mdiTranslate} />
);
