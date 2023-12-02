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

![Preview](preview.png)

hover over a message and click on the "Translate" popover button. to untranslate, click the same
popover button again.

## Limitations

- if you translate your own sent messages and try to edit them, the translated message would be in
  the edit field (avoid this by untranslating before you edit)
- currently there is no way to translate your messages to other people when sending them as i have
  yet to figure out how to patch in a toggle button in the chat bar (plaintext patching is no good
  in this case - we might create conflicts with another plugin)
- currently the only indicator to see if a message is translated is the translate button and the
  translated "badge" as i have yet to figure out how to patch in a `(translated)` indicator similar
  to the `(edited)` indicator
