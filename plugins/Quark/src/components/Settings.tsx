import React from 'react';

import { util } from 'replugged';
import { toast } from 'replugged/common';
import { Button, Switch, SwitchItem, Text, Tooltip } from 'replugged/components';

import { Icon as BaseIcon } from '@shared/react';

import { mdiPencil, mdiRefresh, mdiTrashCan } from '@mdi/js';

import { openCreateQuarkModal, openEditorModal } from './modals';

import { config } from '../util';
import { useQuarks } from '../quark';
import { Quark } from '../types';

export const Icon = (props: {
  tooltip?: string;
  className?: string;
  onClick?: (ev: React.MouseEvent) => void;
  path: string;
}): React.ReactElement => (
  <Tooltip text={props.tooltip}>
    <BaseIcon
      className={props.className}
      onClick={props.onClick}
      path={props.path}
      width={24}
      height={24}
    />
  </Tooltip>
);

export const Card = (props: {
  manage: {
    del: () => Promise<boolean>;
    edit: (quark: Quark) => Promise<boolean>;
    restart: () => boolean;
    start: () => boolean;
    stop: () => boolean;
  };
  name: string;
  quark: Quark;
}): React.ReactElement => (
  <div className='quark-card'>
    <Text.H2 variant='text-md/bold' className='name'>
      {props.name}
    </Text.H2>
    <div className='actions'>
      <div className='buttons'>
        <Icon
          tooltip='Edit'
          onClick={() => openEditorModal(props.name)}
          path={mdiPencil}
          className='button edit'
        />
        <Icon
          tooltip='Delete'
          onClick={() =>
            void props.manage
              .del()
              .then((ok) =>
                ok
                  ? toast.toast(`Deleted "${props.name}"`, toast.Kind.SUCCESS)
                  : toast.toast(
                      `Failed deleting "${props.name}".${
                        config.get('debugging') ? ' See Console for more details.' : ''
                      }`,
                      toast.Kind.FAILURE,
                    ),
              )
          }
          path={mdiTrashCan}
          className='button delete'
        />
        {props.quark.enabled && (
          <Icon
            tooltip='Reload'
            onClick={() => {
              if (props.manage.restart())
                toast.toast(`Restarted "${props.name}"`, toast.Kind.SUCCESS);
              else
                toast.toast(
                  `Failed restarting "${props.name}".${
                    config.get('debugging') ? ' See Console for more details.' : ''
                  }`,
                  toast.Kind.FAILURE,
                );
            }}
            path={mdiRefresh}
            className='button reload'
          />
        )}
      </div>
      <Switch
        className='switch'
        checked={props.quark.enabled}
        onChange={(newValue: boolean): void =>
          void props.manage.edit({ ...props.quark, enabled: newValue }).then((ok) => {
            if (ok && (newValue ? props.manage.start() : props.manage.stop()))
              toast.toast(
                `${newValue ? 'Enabled' : 'Disabled'} "${props.name}"`,
                toast.Kind.SUCCESS,
              );
            else
              toast.toast(
                `Failed ${newValue ? 'enabling' : 'disabling'} "${props.name}".${
                  config.get('debugging') ? ' See Console for more details.' : ''
                }`,
                toast.Kind.FAILURE,
              );
          })
        }
      />
    </div>
  </div>
);

export const Settings = (): React.ReactElement => {
  const quarks = useQuarks();

  return (
    <div className='quark-settings'>
      <SwitchItem
        note='Enable verbose logs'
        {...(util.useSetting(config, 'debugging') as {
          value: boolean;
          onChange: (newValue: boolean) => void;
        })}>
        Debugging
      </SwitchItem>
      <Button className='create-button' onClick={(): void => openCreateQuarkModal()}>
        Create New Quark
      </Button>
      <div className='cards'>
        {quarks.map((quark) => quark.exists && <Card {...quark} key={quark.name} />)}
      </div>
    </div>
  );
};
