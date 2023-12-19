import React from 'react';

import { webpack } from 'replugged';

import { EditorView, basicSetup } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';

import { mergeClassNames } from '@shared/dom';

import { ThemeStore } from '../../types';
import * as github from './theme';

const themeStore = webpack.getByStoreName<ThemeStore>('ThemeStore');

export const CodeMirror = (props: {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}): React.ReactElement => {
  const container = React.useRef<HTMLDivElement>();

  const [theme, setTheme] = React.useState<'dark' | 'light'>(themeStore?.theme || 'dark');
  const themeCompartment = React.useRef(new Compartment());

  const [value, setValue] = React.useState(props?.value || '');

  const [view, setView] = React.useState<EditorView>();

  React.useEffect((): void => {
    view?.dispatch?.({ effects: [themeCompartment.current.reconfigure(github[theme])] });
  }, [theme]);

  React.useEffect((): (() => void) => {
    const listener = (): void => setTheme(themeStore?.theme || 'dark');

    themeStore?.addChangeListener?.(listener);

    return () => themeStore?.removeChangeListener?.(listener);
  }, []);

  // initial setup, value is self handled by CodeMirror
  React.useEffect((): (() => void) | void => {
    if (container.current && !view) {
      container.current.setAttribute('data-theme', theme);

      const newView = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [
            basicSetup,
            javascript(),
            EditorView.updateListener.of((event): void => {
              if (event.docChanged) {
                const doc = event.state.doc.toString();

                setValue(doc);
                props?.onChange?.(doc);
              }
            }),
            themeCompartment.current.of(github[theme]),
          ],
        }),
        parent: container.current,
      });

      setView(newView);

      return (): void => newView?.destroy?.();
    }
  }, [container.current]);

  React.useEffect((): void => {
    setValue(props?.value || '');
  }, [props?.value]);

  return (
    <div
      className={mergeClassNames('quark-codemirror', props?.className)}
      ref={container}
      style={props?.style}
    />
  );
};
