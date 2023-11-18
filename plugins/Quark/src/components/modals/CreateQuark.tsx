import React from 'react';

import { modal, toast } from 'replugged/common';
import { Button, FormItem, Modal, Text, TextInput } from 'replugged/components';
import type { ModalProps } from 'replugged/dist/renderer/modules/common/modal';

import { loadedQuarks, set } from '../../quark';
import { openEditorModal } from './Editor';

export const CreateQuark = (props: ModalProps): React.ReactElement => {
  const [name, setName] = React.useState('');
  const [errorReason, setErrorReason] = React.useState('');
  const exists = React.useMemo(() => loadedQuarks.has(name), [name]);
  const blank = React.useMemo(() => !name, [name]);
  const hasTrailingSpaces = React.useMemo(() => name.length !== name.trim().length, [name]);

  React.useEffect(() => {
    if (exists) setErrorReason('A Quark with the provided name already exists.');
    else if (blank) setErrorReason('A Quark may not have a blank name.');
    else if (hasTrailingSpaces)
      setErrorReason('A Quark may not have a name that has a trailing space.');
    else if (errorReason) setErrorReason('');
  }, [exists, blank, hasTrailingSpaces]);

  React.useEffect(() => setErrorReason(''), []);

  return (
    <Modal.ModalRoot {...props} className='quark-create'>
      <Modal.ModalHeader className='header'>
        <Text.H1 variant='heading-lg/bold'>Create New Quark</Text.H1>
        <Modal.ModalCloseButton onClick={props.onClose} className='close-button' />
      </Modal.ModalHeader>
      <Modal.ModalContent className='content'>
        <FormItem
          className='form'
          title='Quark name'
          note={errorReason}
          noteStyle={{ color: 'var(--text-danger)', marginTop: '4px', fontSize: '13px' }}
          notePosition='after'>
          <TextInput
            className='input'
            value={name}
            onChange={(newName: string) => setName(newName)}
          />
        </FormItem>
        <Button
          className='create-button'
          disabled={exists || blank || hasTrailingSpaces}
          onClick={(): void =>
            void set(name).then((ok) => {
              if (ok) {
                toast.toast(`Created "${name}".`, toast.Kind.SUCCESS);
                void props.onClose().finally(() => openEditorModal(name));
              } else toast.toast(`Failed creating "${name}".`, toast.Kind.FAILURE);
            })
          }>
          Create Quark
        </Button>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};

export const openCreateQuarkModal = (): void => {
  modal.openModal((props) => <CreateQuark {...props} />);
};
