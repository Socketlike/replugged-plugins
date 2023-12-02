import React from 'react';

import { SelectItem } from 'replugged/components';
import { settings, util } from 'replugged';

export const config = await settings.init('lib.evelyn.NoSpotifyPause', {
  pluginStopBehavior: 'ask',
});

export const Settings = (): React.ReactElement => (
  <div>
    <SelectItem
      note='Controls what the plugin does when it stops'
      options={[
        { label: 'Ask whether to restart Discord or not in a popout', value: 'ask' },
        { label: 'Restart Discord immediately', value: 'restart' },
        { label: 'Do nothing', value: 'ignore' },
      ]}
      {...(util.useSetting(config, 'pluginStopBehavior') as {
        value: 'ask' | 'restart' | 'ignore';
        // oh my god, what the fuck is ValType? it is fucking up all of the useSetting calls!
        onChange: (newValue: string) => void;
      })}>
      Plugin Stop Behavior
    </SelectItem>
  </div>
);
