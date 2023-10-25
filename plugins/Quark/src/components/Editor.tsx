import { add as addQuark, get as getQuark, restart as restartQuark } from '@quark';
import { common, components, webpack } from 'replugged';
import { CodeMirror } from './CodeMirror';

const { React, modal } = common;
const { Modal, Text } = components;

const { TabBar } = await webpack.waitForModule<{
  TabBar: ((
    props: React.HTMLAttributes<HTMLDivElement> & {
      type: string;
      look?: string;
      selectedItem: string;
      onItemSelect: (newItem: string) => void;
    },
  ) => JSX.Element) & {
    Item: (
      props: React.HTMLAttributes<HTMLDivElement> & { id: string; key: string },
    ) => JSX.Element;
  };
}>(webpack.filters.byProps('TabBar', 'Slider'));

const tabBarClasses = await webpack.waitForModule<{
  tabBar: string;
  tabBarContainer: string;
  tabBarItem: string;
  topSectionNormal: string;
}>(webpack.filters.byProps('tabBarContainer'));

interface ModalProps {
  transitionState: 0 | 1 | 2 | 3 | 4;
  onClose(): Promise<void>;
}

export const Editor = (props: ModalProps & { quarkName: string }): JSX.Element => {
  const { quarkName, ...modalProps } = props;

  const [currentTab, setCurrentTab] = React.useState<'start' | 'stop'>('start');
  const quark = React.useRef(getQuark(quarkName));
  const startScript = React.useRef(quark?.current?.start || '');
  const stopScript = React.useRef(quark?.current?.stop || '');

  React.useEffect(
    (): (() => void) => (): void => {
      if (
        quark.current &&
        (quark.current.start !== startScript.current || quark.current.stop !== stopScript.current)
      )
        addQuark(
          quarkName,
          {
            enabled: quark.current.enabled,
            start:
              quark.current.start !== startScript.current
                ? startScript.current
                : quark.current.start,
            stop:
              quark.current.stop !== stopScript.current ? stopScript.current : quark.current.stop,
          },
          true,
        );
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
        {!quark.current ? (
          <Text.H1 variant='heading-lg/bold' className='invalid-quark-header'>
            The snippet "
            {typeof quarkName !== 'string' ? '<not displayable>' : quarkName || '<blank>'}" does not
            exist!
          </Text.H1>
        ) : (
          <>
            <div className={`${tabBarClasses.tabBarContainer} tab-bar-container`}>
              <TabBar
                type='top'
                look='brand'
                className={`${tabBarClasses.tabBar} tab-bar`}
                selectedItem={currentTab}
                onItemSelect={(newValue: string): void =>
                  setCurrentTab(newValue as 'start' | 'stop')
                }>
                <TabBar.Item
                  id='start'
                  className={`${tabBarClasses.tabBarItem} tab-bar-item`}
                  key='start'>
                  Start script
                </TabBar.Item>
                <TabBar.Item
                  id='stop'
                  className={`${tabBarClasses.tabBarItem} tab-bar-item`}
                  key='stop'>
                  Stop script
                </TabBar.Item>
              </TabBar>
            </div>
            <CodeMirror
              style={currentTab === 'start' ? {} : { display: 'none' }}
              value={startScript.current}
              onChange={(newValue: string): void => {
                startScript.current = newValue;
              }}
            />
            <CodeMirror
              style={currentTab === 'stop' ? {} : { display: 'none' }}
              value={stopScript.current}
              onChange={(newValue: string): void => {
                stopScript.current = newValue;
              }}
            />
          </>
        )}
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
};

export const openEditor = (quarkName: string): void => {
  modal.openModal((props: ModalProps): JSX.Element => <Editor {...props} quarkName={quarkName} />);
};
