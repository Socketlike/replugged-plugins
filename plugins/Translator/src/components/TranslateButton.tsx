import React from 'react';

import { util } from 'replugged';
import { Clickable, Tooltip } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';

import { TranslateIcon, TranslateOffIcon } from './Icons';

import { config } from '../util';

export const TranslateButton = (): React.ReactElement => {
  const { value: enabled, onChange: setEnabled } = util.useSetting(config, 'sendTranslateEnabled');

  return (
    <div className='translator-send-toggle'>
      <Tooltip text={enabled ? 'Disable Translator' : 'Enable Translator'}>
        <Clickable style={{ marginTop: '5px' }} onClick={() => setEnabled(!enabled)}>
          <button className={mergeClassNames('button', !enabled && 'disabled')}>
            {enabled ? (
              <TranslateIcon width={25} height={25} />
            ) : (
              <TranslateOffIcon width={25} height={25} />
            )}
          </button>
        </Clickable>
      </Tooltip>
    </div>
  );
};
