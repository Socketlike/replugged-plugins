import { EditorView } from 'codemirror';
import { type Extension } from '@codemirror/state';
import { HighlightStyle, type TagStyle, syntaxHighlighting } from '@codemirror/language';
import type { StyleSpec } from 'style-mod';
import { tags } from '@lezer/highlight';

const createTheme = ({
  theme,
  settings = {},
  styles = [],
}: {
  theme: 'dark' | 'light';
  settings: {
    background?: string;
    foreground?: string;
    caret?: string;
    selection?: string;
    selectionMatch?: string;
    lineHighlight?: string;
    gutterBackground?: string;
    gutterForeground?: string;
    gutterActiveForeground?: string;
    gutterBorder?: string;
    fontFamily?: string;
  };
  styles: TagStyle[];
}): Extension => {
  const activeLineGutterStyle: StyleSpec = {};
  const baseStyle: StyleSpec = {};
  const themeOptions: Record<string, StyleSpec> = {
    '.cm-gutters': {},
  };

  if (settings.background) baseStyle.backgroundColor = settings.background;
  if (settings.foreground) baseStyle.color = settings.foreground;
  if (settings.background || settings.foreground) themeOptions['&'] = baseStyle;
  if (settings.fontFamily)
    themeOptions['&.cm-editor .cm-scroller'] = {
      fontFamily: settings.fontFamily,
    };
  if (settings.gutterBackground)
    themeOptions['.cm-gutters'].backgroundColor = settings.gutterBackground;
  if (settings.gutterForeground) themeOptions['.cm-gutters'].color = settings.gutterForeground;
  if (settings.caret) {
    themeOptions['.cm-content'] = {
      caretColor: settings.caret,
    };
    themeOptions['.cm-cursor, .cm-dropCursor'] = {
      borderLeftColor: settings.caret,
    };
  }

  if (settings.gutterActiveForeground)
    activeLineGutterStyle.color = settings.gutterActiveForeground;
  if (settings.lineHighlight) {
    themeOptions['.cm-activeLine'] = {
      backgroundColor: settings.lineHighlight,
    };
    activeLineGutterStyle.backgroundColor = settings.lineHighlight;
  }
  if (settings.selection)
    themeOptions[
      '&.cm-focused .cm-selectionBackground, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection'
    ] = {
      backgroundColor: settings.selection,
    };
  if (settings.selectionMatch)
    themeOptions['& .cm-selectionMatch'] = {
      backgroundColor: settings.selectionMatch,
    };

  const themeExtension = EditorView.theme(themeOptions, {
    dark: theme === 'dark',
  });

  const highlightStyle = HighlightStyle.define(styles);

  return [themeExtension, syntaxHighlighting(highlightStyle)];
};

export default {
  light: createTheme({
    theme: 'light',
    settings: {
      background: '#fff',
      foreground: '#24292e',
      selection: '#BBDFFF',
      selectionMatch: '#BBDFFF',
      gutterBackground: '#fff',
      gutterForeground: '#6e7781',
    },
    styles: [
      { tag: [tags.standard(tags.tagName), tags.tagName], color: '#116329' },
      { tag: [tags.comment, tags.bracket], color: '#6a737d' },
      { tag: [tags.className, tags.propertyName], color: '#6f42c1' },
      {
        tag: [tags.variableName, tags.attributeName, tags.number, tags.operator],
        color: '#005cc5',
      },
      { tag: [tags.keyword, tags.typeName, tags.typeOperator, tags.typeName], color: '#d73a49' },
      { tag: [tags.string, tags.meta, tags.regexp], color: '#032f62' },
      { tag: [tags.name, tags.quote], color: '#22863a' },
      { tag: [tags.heading], color: '#24292e', fontWeight: 'bold' },
      { tag: [tags.emphasis], color: '#24292e', fontStyle: 'italic' },
      { tag: [tags.deleted], color: '#b31d28', backgroundColor: '#ffeef0' },
      { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#e36209' },
      { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: '#032f62' },
      { tag: tags.link, textDecoration: 'underline' },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      { tag: tags.invalid, color: '#cb2431' },
    ],
  }),
  dark: createTheme({
    theme: 'dark',
    settings: {
      background: '#0d1117',
      foreground: '#c9d1d9',
      caret: '#c9d1d9',
      selection: '#003d73',
      selectionMatch: '#003d73',
      lineHighlight: '#36334280',
    },
    styles: [
      { tag: [tags.standard(tags.tagName), tags.tagName], color: '#7ee787' },
      { tag: [tags.comment, tags.bracket], color: '#8b949e' },
      { tag: [tags.className, tags.propertyName], color: '#d2a8ff' },
      {
        tag: [tags.variableName, tags.attributeName, tags.number, tags.operator],
        color: '#79c0ff',
      },
      { tag: [tags.keyword, tags.typeName, tags.typeOperator, tags.typeName], color: '#ff7b72' },
      { tag: [tags.string, tags.meta, tags.regexp], color: '#a5d6ff' },
      { tag: [tags.name, tags.quote], color: '#7ee787' },
      { tag: [tags.heading], color: '#d2a8ff', fontWeight: 'bold' },
      { tag: [tags.emphasis], color: '#d2a8ff', fontStyle: 'italic' },
      { tag: [tags.deleted], color: '#ffdcd7', backgroundColor: '#ffeef0' },
      { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: '#ffab70' },
      { tag: tags.link, textDecoration: 'underline' },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      { tag: tags.invalid, color: '#f97583' },
    ],
  }),
};
