import {
  Quark,
  add as addQuark,
  getAll as getAllQuarks,
  has as hasQuark,
  remove as removeQuark,
  toggle as toggleQuark,
} from '@quark';
import { config } from '@util';
import { mdiPencil, mdiTrashCan } from '@mdi/js';
import { openEditor } from './Editor';
import { common, components, util } from 'replugged';

const { React, modal, toast } = common;
const { Button, FormItem, Modal, Switch, SwitchItem, Text, TextInput, Tooltip } = components;

interface ModalProps {
  transitionState: 0 | 1 | 2 | 3 | 4;
  onClose(): Promise<void>;
}

const Icon = (props: {
  tooltip?: string;
  className?: string;
  onClick?: (ev: React.MouseEvent) => void;
  path: string;
}): JSX.Element => (
  <Tooltip text={props.tooltip}>
    <svg
      className={props.className}
      onClick={props.onClick}
      width={24}
      height={24}
      viewBox='0 0 24 24'>
      <path d={props.path} fill='currentColor' />
    </svg>
  </Tooltip>
);

const Card = (props: {
  name: string;
  quark: Quark;
  forceUpdateParent: () => void;
}): JSX.Element => {
  const { name, quark, forceUpdateParent } = props;

  const [enabled, setEnabled] = React.useState(quark.enabled || false);

  return (
    <div className='quark-card'>
      <Text.H2 variant='text-md/bold' className='name'>
        {typeof name === 'string' ? name || '<blank>' : '<not displayable>'}
      </Text.H2>
      <div className='actions'>
        <div className='buttons'>
          <Icon
            tooltip='Edit scripts'
            onClick={() => openEditor(name)}
            path={mdiPencil}
            className='edit'
          />
          <Icon
            tooltip='Delete snippet'
            onClick={() => {
              removeQuark(name);
              toast.toast(`Deleted "${name}"`, toast.Kind.SUCCESS);
              forceUpdateParent();
            }}
            path={mdiTrashCan}
            className='delete'
          />
        </div>
        <Switch
          className='switch'
          checked={enabled}
          onChange={(newValue: boolean): void => {
            toggleQuark(name, newValue);
            toast.toast(`${newValue ? 'Enabled' : 'Disabled'} "${name}"`, toast.Kind.SUCCESS);
            setEnabled(newValue);
          }}
        />
      </div>
    </div>
  );
};

const NewQuarkModal = (props: ModalProps & { forceUpdate: () => void }): JSX.Element => {
  const { forceUpdate, ...modalProps } = props;

  const [name, setName] = React.useState('');
  const firstStart = React.useRef(true);
  const alreadyExists = React.useMemo((): boolean => hasQuark(name.trim()), [name]);
  const blankName = React.useMemo((): boolean => !name.trim(), [name]);
  const valid = React.useMemo(
    (): boolean => !(alreadyExists || blankName),
    [alreadyExists, blankName],
  );
  const reason = React.useMemo((): string => {
    if (firstStart.current) return '';
    else if (blankName) return 'This snippet has an invalid name. (spaces only / blank name)';
    else if (alreadyExists) return 'A snippet with this name already exists.';

    return '';
  }, [valid]);

  React.useEffect((): void => {
    firstStart.current = false;
  }, []);

  return (
    <Modal.ModalRoot {...modalProps} className='quark-new'>
      <Modal.ModalHeader className='header'>
        <Text.H1 variant='heading-lg/bold'>Create New Snippet</Text.H1>
        <Modal.ModalCloseButton onClick={modalProps.onClose} className='close-button' />
      </Modal.ModalHeader>
      <Modal.ModalContent className='content'>
        <FormItem
          className='input-form'
          title='Snippet name'
          note={reason}
          noteStyle={{
            color: 'var(--text-danger)',
            marginTop: '4px',
            fontSize: '13px',
          }}
          notePosition='after'>
          <TextInput
            className='input'
            value={name}
            onChange={(newName: string): void => {
              setName(newName);
            }}
          />
        </FormItem>
        <Button
          className='create-button'
          disabled={!valid}
          onClick={(): void => {
            addQuark(name.trim(), { enabled: false, start: '', stop: '' });
            openEditor(name.trim());
            forceUpdate();
            modalProps.onClose();
          }}>
          Create Snippet
        </Button>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};

const openNewQuarkModal = (forceUpdate: () => void): void => {
  modal.openModal(
    (props: ModalProps): JSX.Element => <NewQuarkModal {...props} forceUpdate={forceUpdate} />,
  );
};

export const Settings = (): JSX.Element => {
  const [, forceUpdate] = React.useReducer((x: number): number => x + 1, 0);

  return (
    <div className='quark-settings'>
      <SwitchItem note='Enable more verbose logs' {...util.useSetting(config, 'debugging')}>
        Debugging
      </SwitchItem>
      <Button className='new-button' onClick={(): void => openNewQuarkModal(forceUpdate)}>
        New Snippet
      </Button>
      {Object.entries(getAllQuarks()).map(
        ([name, quark]): JSX.Element => (
          <Card name={name} quark={quark} forceUpdateParent={forceUpdate} />
        ),
      )}
    </div>
  );
};
