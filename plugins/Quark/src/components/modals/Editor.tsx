import React from 'react';

import { webpack } from 'replugged';
import { components, modal, toast } from 'replugged/common';
import { ErrorBoundary, Modal, Text } from 'replugged/components';
import type { ModalProps } from 'replugged/dist/renderer/modules/common/modal';

import { mergeClassNames } from '@shared/dom';
import type { TabBar } from '@shared/types';

import { CodeMirror } from '../CodeMirror';
import { useQuark } from '../../quark';

const { TabBar } = components as typeof components & { TabBar: TabBar };

const tabBarClasses = await webpack.waitForModule<{
  tabBar: string;
  tabBarItem: string;
}>(webpack.filters.byProps('tabBarItem'));

export const Editor = (props: { name: string } & ModalProps): React.ReactElement => {
  const { name, ...modalProps } = props;

  const {
    quark,
    manage: { edit, restart },
    exists,
  } = useQuark(name);
  const [currentTab, setCurrentTab] = React.useState<'start' | 'stop'>('start');
  const startRef = React.useRef(quark?.start || '');
  const stopRef = React.useRef(quark?.stop || '');

  React.useEffect(() => {
    if (!exists)
      void modalProps
        .onClose()
        .finally(() =>
          toast.toast(
            `"${name}" doesn't exist anymore, so we closed the editor.`,
            toast.Kind.FAILURE,
          ),
        );
  }, [exists]);

  React.useEffect(
    () => () => {
      if (exists && (startRef.current !== quark.start || stopRef.current !== quark.stop))
        void edit({ ...quark, start: startRef.current, stop: stopRef.current }).then((ok) => {
          if (ok && quark.enabled) restart();

          toast.toast(
            ok
              ? `Saved "${name}"${quark.enabled ? ' and restarted it' : ''}.`
              : `Failed saving "${name}". Check Console for more details.`,
          );
        });
    },
    [],
  );

  return (
    <Modal.ModalRoot {...modalProps} className='quark-editor'>
      <Modal.ModalHeader className='header'>
        <Text.H1 variant='heading-lg/bold'>Edit Snippet</Text.H1>
        <Modal.ModalCloseButton onClick={modalProps.onClose} className='close-button' />
      </Modal.ModalHeader>
      <Modal.ModalContent className='content'>
        <ErrorBoundary>
          <>
            <div className='tab-bar-container'>
              <TabBar
                type='top'
                look='brand'
                className={mergeClassNames('tab-bar', tabBarClasses?.tabBar)}
                selectedItem={currentTab}
                onItemSelect={(newValue: string): void =>
                  setCurrentTab(newValue as 'start' | 'stop')
                }>
                <TabBar.Item
                  id='start'
                  className={mergeClassNames('tab-bar-item', tabBarClasses?.tabBarItem)}
                  key='start'>
                  Start script
                </TabBar.Item>
                <TabBar.Item
                  id='stop'
                  className={mergeClassNames('tab-bar-item', tabBarClasses?.tabBarItem)}
                  key='stop'>
                  Stop script
                </TabBar.Item>
              </TabBar>
            </div>
            <CodeMirror
              style={currentTab === 'start' ? {} : { display: 'none' }}
              value={startRef.current}
              onChange={(newValue: string): void => {
                startRef.current = newValue;
              }}
            />
            <CodeMirror
              style={currentTab === 'stop' ? {} : { display: 'none' }}
              value={stopRef.current}
              onChange={(newValue: string): void => {
                stopRef.current = newValue;
              }}
            />
          </>
        </ErrorBoundary>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};

export const openEditorModal = (quarkName: string): void => {
  modal.openModal((props): React.ReactElement => <Editor name={quarkName} {...props} />);
};
