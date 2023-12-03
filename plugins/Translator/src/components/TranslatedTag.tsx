import React from 'react';

import { webpack } from 'replugged';

import { mergeClassNames } from '@shared/dom';

const chatMessageClasses = await webpack.waitForModule<{ edited: string }>(
  webpack.filters.byProps('alt', 'edited'),
);

export const TranslatedTag = (): React.ReactElement => (
  <>
    {' '}
    <span className={mergeClassNames('translator-translated-tag', chatMessageClasses?.edited)}>
      (translated)
    </span>
  </>
);
