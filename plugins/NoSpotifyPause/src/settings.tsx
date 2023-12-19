import React from 'react';

import { SelectItem } from 'replugged/components';
import { settings, util } from 'replugged';

const defaultConfig: {
  pluginStopBehavior: 'ask' | 'restart' | 'ignore' | string;
} = {
  pluginStopBehavior: 'ask',
};

export const config = await settings.init('lib.evelyn.NoSpotifyPause', defaultConfig);

export const Settings = (): React.ReactElement => (
  <div>
    <SelectItem
      note='Controls what the plugin does when it stops'
      options={[
        { label: 'Ask whether to restart Discord or not in a popout', value: 'ask' },
        { label: 'Restart Discord immediately', value: 'restart' },
        { label: 'Do nothing', value: 'ignore' },
      ]}
      {...util.useSetting(config, 'pluginStopBehavior')}>
      Plugin Stop Behavior
    </SelectItem>
  </div>
);
