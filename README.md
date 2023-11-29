<p>
  <h1 align="center">replugged-plugins</h1>
</p>

<p align="center">
  <a href="https://github.com/Socketlike/replugged-plugins/actions/workflows/lint.yml">
    <img alt="lint status" src="https://img.shields.io/github/actions/workflow/status/Socketlike/replugged-plugins/lint.yml?label=lint">
  </a>
  <a href="https://github.com/Socketlike/replugged-plugins/actions/workflows/release.yml">
    <img alt="build status" src="https://img.shields.io/github/actions/workflow/status/Socketlike/replugged-plugins/release.yml?label=build">
  </a>
</p>

<p align="center">
  <a href="https://replugged.dev/install?identifier=lib.evelyn.Magnificent">
    <img alt="install Magnificent" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.Magnificent&query=%24.version&prefix=v&label=Install%20Magnificent&style=for-the-badge">
  </a>
  <a href="https://replugged.dev/install?identifier=lib.evelyn.SpotifyModal">
    <img alt="install SpotifyModal" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.SpotifyModal&query=%24.version&prefix=v&label=Install%20SpotifyModal&style=for-the-badge">
  </a>
  <a href="https://replugged.dev/install?identifier=lib.evelyn.NoSpotifyPause">
    <img alt="install NoSpotifyPause" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.NoSpotifyPause&query=%24.version&prefix=v&label=Install%20NoSpotifyPause&style=for-the-badge">
  </a>
  <a href="https://replugged.dev/install?identifier=lib.evelyn.SpotifyListenAlong">
    <img alt="install SpotifyListenAlong" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.SpotifyListenAlong&query=%24.version&prefix=v&label=Install%20SpotifyListenAlong&style=for-the-badge">
  </a>
  <a href="https://replugged.dev/install?identifier=Socketlike/replugged-plugins&id=lib.evelyn.Quark&source=github">
    <img alt="install Quark" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FSocketlike%2Freplugged-plugins%2Fraw%2Fmain%2Fplugins%2FQuark%2Fmanifest.json&query=%24.version&prefix=v&label=Install%20Quark&style=for-the-badge">
  </a>
</p>

<p align="center">
  a collection of plugins I made for <a href="https://replugged.dev">Replugged</a>, a Discord client mod.
</p>

## List of plugins

- [Magnificent](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/Magnificent):
  removes the width & height restriction of images in image popouts.
- [SpotifyModal](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/SpotifyModal):
  shows a little modal on your user dock that lets you see & control what you're playing on Spotify.
- [NoSpotifyPause](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/NoSpotifyPause):
  stops Discord from pausing your Spotify playback while in VC.
- [SpotifyListenAlong](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/SpotifyListenAlong):
  allows you to use the "Listen along" feature without Spotify Premium, because Spotify Premium is
  not actually required
- [Quark](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/Quark): allows you to
  create persistent (runs every startup) JavaScript snippets.

## Building

- Clone repository
  ```bash
  git clone https://github.com/Socketlike/replugged-plugins --recurse-submodules
  ```
- Install dependencies
  ```bash
  pnpm i
  ```
- Build
  ```bash
  pnpm build:dev # unminified & sourcemapped artifacts
  pnpm build:prod # minified artifacts
  ```
- Then load missing plugins
