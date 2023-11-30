import React from 'react';
import ISO6391 from 'iso-639-1';

import { util } from 'replugged';
import { Category, FormItem, SelectItem, TextInput } from 'replugged/components';

import { ToPrimitive } from '@shared/types';

import { DefaultConfig, config } from '../util';

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
    onChange: (newValue) => onChange(newValue as DefaultConfig[T]),
  };
};

const languages = ISO6391.getAllCodes().map((code) => [code, ISO6391.getNativeName(code)]);

export const Settings = (): React.ReactElement => {
  const apiKeys = useSetting('apiKeys');

  return (
    <div className='translator-settings'>
      <SelectItem
        options={[
          { label: 'Google', value: 'google' },
          { label: 'DeepL (API key required)', value: 'deepl' },
          { label: 'Yandex (API key required)', value: 'yandex' },
          { label: 'LibreTranslate', value: 'libre' },
        ]}
        {...useSetting('engine')}>
        Default Translator Engine
      </SelectItem>
      <SelectItem
        options={[
          { label: 'Discord Language', value: '' },
          ...languages.map(([code, name]) => ({ label: `${name} (${code})`, value: code })),
        ]}
        note={'Specify which language to translate messages into.'}
        {...useSetting('language')}>
        Target Language
      </SelectItem>
      <Category title='Engine Config' note='Specify API keys, etc... for translator engines'>
        <FormItem className='form' title='DeepL API Key'>
          <TextInput
            className='input'
            value={apiKeys.value.deepl}
            onChange={(newValue) => apiKeys.onChange({ ...apiKeys.value, deepl: newValue })}
          />
        </FormItem>
        <FormItem className='form' title='Yandex API Key'>
          <TextInput
            className='input'
            value={apiKeys.value.yandex}
            onChange={(newValue) => apiKeys.onChange({ ...apiKeys.value, yandex: newValue })}
          />
        </FormItem>
        <FormItem className='form' title='LibreTranslate Endpoint URL'>
          <TextInput className='input' {...useSetting('urlLibreTranslate')} />
        </FormItem>
      </Category>
    </div>
  );
};
