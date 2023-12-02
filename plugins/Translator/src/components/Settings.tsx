import React from 'react';
import { Languages } from '@sckt/translate';

import { util } from 'replugged';
import { FormItem, SelectItem, TextInput } from 'replugged/components';

import { ToPrimitive } from '@shared/types';

import { DefaultConfig, config, events } from '../util';

const useSetting = <T extends keyof DefaultConfig>(
  key: T,
): {
  value: DefaultConfig[T];
  /** using `ToPrimitive` on `newValue` is needed because we can't enforce literals on settings items' values */
  onChange: (newValue: ToPrimitive<DefaultConfig[T]>) => void;
} => {
  const { value, onChange } = util.useSetting(config, key);

  return {
    value,
    onChange: (newValue) => {
      onChange(newValue);

      if (value !== newValue) events.emit('languageChanged', newValue);
    },
  };
};

const languages = Languages.getLanguages(Languages.getAllCodes()).map(({ code, nativeName }) => ({
  value: code,
  label: `${nativeName} (${code})`,
}));

export const Settings = (): React.ReactElement => (
  <div className='translator-settings'>
    <SelectItem
      options={[{ label: 'Discord Language', value: '' }, ...languages]}
      note={
        'Specify which language to translate messages into. Changing this will reset all previously translated messages!'
      }
      {...useSetting('language')}>
      Target Language
    </SelectItem>
    <FormItem className='form' title='Lingva Translate API Instance'>
      <TextInput className='input' {...useSetting('url')} />
    </FormItem>
  </div>
);
