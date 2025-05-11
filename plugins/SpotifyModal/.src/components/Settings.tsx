import React from 'react';

import { util } from 'replugged';
import { lodash as _ } from 'replugged/common';
import { Category, Divider, FormItem, SelectItem, Slider, SwitchItem } from 'replugged/components';

import { ToPrimitive } from '@shared/types/util';

import { globalEvents } from '../util';
import { DefaultConfig, config } from '../config';

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
      config.set(key, newValue as DefaultConfig[T]);

      globalEvents.emit('settingsUpdate', {
        key,
        value: newValue as DefaultConfig[T],
      });

      onChange(newValue as DefaultConfig[T]);
    },
  };
};

export const Settings = (): React.ReactElement => (
  <div className='spotify-modal-settings'>
    <Category title='Visibility' note="Change specific elements' visibility">
      <SelectItem
        note="Changes the visibility of the Modal's seekbar"
        options={[
          { label: 'Shown', value: 'always' },
          { label: 'Hidden', value: 'hidden' },
          { label: 'Shown on hover', value: 'auto' },
        ]}
        {...useSetting('seekbarVisibilityState')}>
        Seekbar Visibility
      </SelectItem>
      <SelectItem
        note="Changes the visibility of the Modal's player controls"
        options={[
          { label: 'Shown', value: 'always' },
          { label: 'Hidden', value: 'hidden' },
          { label: 'Shown on hover', value: 'auto' },
        ]}
        {...useSetting('controlsVisibilityState')}>
        Controls Visibility
      </SelectItem>
    </Category>
    <SelectItem
      note='Controls what the plugin should do when it stops'
      options={[
        { label: 'Ask whether to restart Discord or not in a popout', value: 'ask' },
        { label: 'Restart Discord immediately', value: 'restart' },
        { label: 'Do nothing', value: 'ignore' },
      ]}
      {...useSetting('pluginStopBehavior')}>
      Plugin Stop Behavior
    </SelectItem>
    <SwitchItem
      note='Prints more debug info to Console (warning: very noisy!)'
      {...useSetting('debugging')}>
      Debugging
    </SwitchItem>
    <SwitchItem
      note='Use Spotify URIs (open directly in Spotify) instead of normal links for hyperlinks.'
      {...useSetting('hyperlinkURI')}>
      Use Spotify URI
    </SwitchItem>
    <SwitchItem
      note="...when your playback progress is past a percentage of the currently playing track's duration, like Spotify does."
      {...useSetting('skipPreviousShouldResetProgress')}>
      Allow "Skip to Previous" to reset playback progress
    </SwitchItem>
    <FormItem
      title='"Skip to Previous" reset progress threshold'
      note={`The percentage of the currently playing track's duration to start allowing "Skip to Previous" to reset playback progress`}>
      <Slider
        className={'skip-prev-percent-slider'}
        disabled={!config.get('skipPreviousShouldResetProgress')}
        minValue={0}
        maxValue={1}
        markers={_.range(0, 1.05, 0.05).map((v) => Number(v.toFixed(2)))}
        onMarkerRender={(marker: number): string => `${Math.floor(marker * 100)}%`}
        {...useSetting('skipPreviousProgressResetThreshold')}
      />
      <Divider style={{ marginTop: '20px' }} />
    </FormItem>
  </div>
);
