import { common, components, settings, util } from 'replugged';

const { React } = common;
const { SelectItem } = components;

export const config = await settings.init('lib.evelyn.NoSpotifyPause', {
  pluginStopBehavior: 'ask',
});

export const Settings = (): JSX.Element => (
  <div>
    <SelectItem
      note='Controls what the plugin does when it stops'
      options={[
        { label: 'Ask whether to restart Discord or not in a popout', value: 'ask' },
        { label: 'Restart Discord', value: 'restartDiscord' },
        { label: 'Do not restart Discord', value: 'doNotRestartDiscord' },
      ]}
      {...util.useSetting(config, 'pluginStopBehavior')}>
      Plugin Stop Behavior
    </SelectItem>
  </div>
);
