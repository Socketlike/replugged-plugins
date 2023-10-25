/* 
  Jesus fucking Christ this was a nightmare.
  Thank god that Replugged source code exists.
  I'm never doing anything remotely close to CodeMirror ever again.
*/
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { common, webpack } from 'replugged';
import github from './theme';

const { React } = common;

const themeModule = await webpack.waitForModule<{
  theme: 'dark' | 'light';
  addChangeListener: (listener: () => unknown) => unknown;
  removeChangeListener: (listener: () => unknown) => unknown;
}>(webpack.filters.byProps('theme', 'addChangeListener', 'removeChangeListener'));

const useTheme = (): 'dark' | 'light' => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');

  if (themeModule) {
    const onThemeChange = (): void => setTheme(themeModule.theme);

    React.useEffect((): (() => void) => {
      onThemeChange();
      themeModule.addChangeListener(onThemeChange);

      return () => themeModule.removeChangeListener(onThemeChange);
    }, []);
  }

  return theme;
};

const useCodeMirror = (props: {
  value?: string;
  onChange?: (newValue: string) => void;
  container?: HTMLDivElement | null;
}): [string, (newValue: string) => void] => {
  const { value: initialValue, onChange, container } = props;

  const theme = useTheme();

  const [value, setValue] = React.useState('');
  const [view, setView] = React.useState<EditorView | null>(null);
  const [_, forceUpdate] = React.useReducer((x: number): number => x + 1, 0);

  React.useEffect((): void => {
    if (initialValue) {
      setValue(initialValue);
      forceUpdate();
    }
  }, [initialValue]);

  React.useEffect((): (() => void) => {
    if (!container) return (): void => {};
    if (view) view.destroy();

    const newView = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          EditorView.updateListener.of((update): void => {
            if (update.docChanged) {
              const newDoc = update.state.doc.toString();

              setValue(newDoc);
              onChange?.(newDoc);
            }
          }),
          github[theme || 'dark'],
        ],
      }),
      parent: container,
    });

    setView(newView);

    container.setAttribute('data-theme', theme);

    return (): void => {
      newView?.destroy();
      setView(null);
    };
  }, [container, theme, _]);

  const externalSetValue = React.useCallback(
    (newValue: string): void => {
      setValue(newValue);
      forceUpdate();
    },
    [view],
  );

  return [value, externalSetValue];
};

export const CodeMirror = (props: {
  value?: string;
  onChange?: (newDoc: string) => void;
  className?: string;
  style?: React.CSSProperties;
}): JSX.Element => {
  const { value: initialValue, onChange, className, style } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const firstSet = React.useRef(false);
  const [value, setValue] = useCodeMirror({
    container: ref.current,
  });

  React.useEffect((): void => {
    firstSet.current = true;
    setValue(initialValue);
  }, []);

  React.useEffect((): void => {
    if (!firstSet.current) onChange?.(value);
    else firstSet.current = false;
  }, [value]);

  return (
    <div
      ref={ref}
      className={`quark-codemirror${
        typeof className === 'string' && className ? ` ${className}` : ''
      }`}
      style={style}
    />
  );
};
