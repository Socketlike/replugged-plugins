import React from 'react';

import { modal } from 'replugged/common';
import { Modal, Text, Tooltip } from 'replugged/components';
import type { ModalProps } from 'replugged/dist/renderer/modules/common/modal';

import { mdiHelpCircle } from '@mdi/js';

import { Icon } from '@shared/react';

export const AuthLinkGuide = (props: ModalProps): React.ReactElement => {
  return (
    <Modal.ModalRoot {...props} className='spotify-modal-oauth2-guide'>
      <Modal.ModalHeader className='header'>
        <Text.H1 variant='heading-lg/bold'>Spotify OAuth2 Guide</Text.H1>
      </Modal.ModalHeader>
      <Modal.ModalContent>
        <div />
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};

export const AuthLinkGenerator = (props: ModalProps): React.ReactElement => {
  return (
    <Modal.ModalRoot {...props} className='spotify-modal-oauth2-generator'>
      <Modal.ModalHeader className='header'>
        <Text.H1 variant='heading-lg/bold'>Spotify OAuth2 Link Generator</Text.H1>
        <Tooltip text='Guide' className='guide-button-tooltip'>
          <Icon
            onClick={(): void => {
              modal.openModal((props) => <AuthLinkGuide {...props} />);
            }}
            className='guide-button'
            path={mdiHelpCircle}
          />
        </Tooltip>
      </Modal.ModalHeader>
      <Modal.ModalContent className='content'>
        <div></div>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};
