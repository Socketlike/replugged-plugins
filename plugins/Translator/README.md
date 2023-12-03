<p>
  <h1 align="center">Translator</h1>
</p>

<p align="center">
  <a href="https://replugged.dev/install?identifier=lib.evelyn.Translator">
    <img alt="install" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.Translator&query=%24.version&prefix=v&label=Install&style=for-the-badge">
  </a>
</p>

<p align="center">
  a Replugged plugin that allows you to translate messages in-app.
</p>

## Usage

**configure your desired languages in the plugin settings first**. then you may:

<img align="right" src="popoverPreview.png">

- translate others' messages to your language: hover over a message and click on the "Translate"
  popover button. to untranslate, click the same popover button again.

<br clear="right" />

<img align="right" src="chatPanelButtonPreview.png">

- translate your messages to others' language: enable the translator by clicking on the
  `Enable Translator` button in the chat bar.

## Limitations

- if you translate your own messages by using the `Translate` popover button and try to edit them,
  the translated message would be in the edit field (avoid this by pressing the `Untranslate`
  popover button before you edit)
- if you reply to a translated message, the replied message preview will show the original,
  untranslated message content
