import { util } from 'replugged';
import { React, lodash as _ } from 'replugged/common';
import { Category, Divider, FormItem, SelectItem, Slider, SwitchItem } from 'replugged/components';

import { events, useTrappedSettingsState } from '../util';
import { DefaultConfig, DefaultConfigKeys, config } from '../config';

const updateSetting = <T extends DefaultConfigKeys, D extends DefaultConfig[T]>(
  key: T,
  value: D,
): void => {
  config.set(key, value);
  events.emit('settingsUpdate', {
    key,
    value,
  });
};

export const Settings = (): JSX.Element => (
  <div className='spotify-modal-settings'>
    <Category title='Visibility' note="Change specific elements' visibility state">
      <SelectItem
        note='Changes the visibility of the seekbar in the modal'
        options={[
          { label: 'Shown', value: 'always' },
          { label: 'Hidden', value: 'hidden' },
          { label: 'Shown on hover', value: 'auto' },
        ]}
        {...useTrappedSettingsState(
          util.useSetting(config, 'seekbarVisibilityState'),
          'seekbarVisibilityState',
          updateSetting,
        )}>
        Seekbar Visibility
      </SelectItem>
      <SelectItem
        note='Changes the visibility state of the control buttons in the modal'
        options={[
          { label: 'Shown', value: 'always' },
          { label: 'Hidden', value: 'hidden' },
          { label: 'Shown on hover', value: 'auto' },
        ]}
        {...useTrappedSettingsState(
          util.useSetting(config, 'controlsVisibilityState'),
          'controlsVisibilityState',
          updateSetting,
        )}>
        Controls Visibility
      </SelectItem>
    </Category>
    <SelectItem
      note='Controls what the plugin does when it stops'
      options={[
        { label: 'Ask whether to restart Discord or not in a popout', value: 'ask' },
        { label: 'Restart Discord immediately', value: 'restart' },
        { label: 'Do nothing', value: 'ignore' },
      ]}
      {...useTrappedSettingsState(
        util.useSetting(config, 'pluginStopBehavior'),
        'pluginStopBehavior',
        updateSetting,
      )}>
      Plugin Stop Behavior
    </SelectItem>
    <SwitchItem
      note='Prints more verbose logs to console (warning: very noisy!)'
      {...useTrappedSettingsState(
        util.useSetting(config, 'debugging'),
        'debugging',
        updateSetting,
      )}>
      Debugging
    </SwitchItem>
    <SwitchItem
      note='Use Spotify URIs (open directly in Spotify) instead of normal links for hyperlinks'
      {...useTrappedSettingsState(
        util.useSetting(config, 'hyperlinkURI'),
        'hyperlinkURI',
        updateSetting,
      )}>
      Use Spotify URI
    </SwitchItem>
    <SwitchItem
      note='Make the skip previous control reset your track playback progress when it is past a percentage of the track'
      {...useTrappedSettingsState(
        util.useSetting(config, 'skipPreviousShouldResetProgress'),
        'skipPreviousShouldResetProgress',
        updateSetting,
      )}>
      Skip previous should reset progress
    </SwitchItem>
    <FormItem
      title='Skip previous reset progress threshold'
      note='The percentage of the track duration to ignore playback progress reset on clicking skip previous.'>
      <Slider
        className={'skip-prev-percent-slider'}
        disabled={!config.get('skipPreviousShouldResetProgress')}
        minValue={0}
        maxValue={1}
        markers={_.range(0, 1.05, 0.05).map((v) => Number(v.toFixed(2)))}
        {...useTrappedSettingsState(
          util.useSetting(config, 'skipPreviousProgressResetThreshold'),
          'skipPreviousProgressResetThreshold',
          updateSetting,
        )}
        onMarkerRender={(marker: number): string => `${Math.floor(marker * 100)}%`}
      />
      <Divider style={{ marginTop: '20px' }} />
    </FormItem>
  </div>
);
