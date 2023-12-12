import React from 'react';
import { Languages } from '@sckt/translate';

import { util } from 'replugged';
import { FormItem, SelectItem, TextInput } from 'replugged/components';

import { DefaultConfig, config, events } from '../util';

const useSetting = <T extends keyof DefaultConfig>(
  key: T,
): {
  value: DefaultConfig[T];
  onChange: (newValue: DefaultConfig[T]) => void;
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
      note='The language you speak. Messages will be translated to this language. Changing this will reset all previously translated messages!'
      {...useSetting('yourLanguage')}>
      Your Language
    </SelectItem>
    <SelectItem
      options={[{ label: 'Discord Language', value: '' }, ...languages]}
      note='The language you wish you could speak. Your messages will be translated to this language.'
      {...useSetting('targetLanguage')}>
      Target Language
    </SelectItem>
    <FormItem
      className='form'
      title='Google Cloud Translate API Key'
      note='Leave this blank to use the free Google Translate API.'>
      <TextInput className='input' {...useSetting('apiKey')} />
    </FormItem>
  </div>
);
