import { Category, SelectItem, SwitchItem, Text, FormItem } from 'replugged/components';

import { useSetting } from 'replugged/util';

import config from './config';

export default (): React.ReactElement => {
  const version = useSetting(config, 'v');

  const general = {
    reduceMotion: useSetting(config, 'general.reduceMotion'),
  };

  const controls = {
    enabled: useSetting(config, 'controls.enabled'),
    collapseOnBlur: useSetting(config, 'controls.collapseOnBlur'),
  };

  const seekbar = {
    enabled: useSetting(config, 'seekbar.enabled'),
    collapseOnBlur: useSetting(config, 'seekbar.collapseOnBlur'),
  };

  return (
    <div className='spotify-modal-settings'>
      <Category title='General'>
        <SelectItem
          options={[
            {
              label: "Use Discord's Reduce Motion setting",
              value: 'discord',
            },
            {
              label: 'On',
              value: 'true',
            },
            {
              label: 'Off',
              value: 'false',
            },
          ]}
          value={String(general.reduceMotion.value)}
          onChange={(value) => {
            let val: string | boolean = value;

            if (val !== 'discord') val = val !== 'false';

            general.reduceMotion.onChange(val);
          }}>
          Reduce motion
        </SelectItem>
      </Category>

      <Category title='Controls'>
        <SwitchItem {...controls.enabled}>Enable controls</SwitchItem>
        <SwitchItem note='Show controls only on hover' {...controls.collapseOnBlur}>
          Collapse on blur
        </SwitchItem>
      </Category>

      <Category title='Seekbar'>
        <SwitchItem {...seekbar.enabled}>Enable seekbar</SwitchItem>
        <SwitchItem note='Show seekbar only on hover' {...seekbar.collapseOnBlur}>
          Collapse on blur
        </SwitchItem>
      </Category>

      <Text.Eyebrow className='version' selectable={false} style={{ color: 'var(--text-muted)' }}>
        settings v{version.value}
      </Text.Eyebrow>
    </div>
  );
};
