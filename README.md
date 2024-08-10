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
  <a href="https://discord.gg/73QMG6fqhg">
    <img alt="support server" src="https://img.shields.io/badge/support%20server-gray?logo=discord&logoColor=fff&labelColor=5865f2">
  </a>
</p>

<p align="center">
  a collection of plugins I made for <a href="https://replugged.dev">Replugged</a>, a Discord client mod.
</p>

> [!IMPORTANT]
> Due to problems with my laptop (which is the only computer I possess),
> I will no longer be able to maintain any of my projects for an indefinite period.
> 
> If you wish to maintain this project, you can do so in the form of PRs.

## List of plugins

- [Magnificent](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/Magnificent)
  <a href="https://replugged.dev/install?identifier=lib.evelyn.Magnificent">
  <img alt="install Magnificent" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.Magnificent&query=%24.version&prefix=v&label=install">
  </a>: removes the width & height restriction of images in image popouts.
- [NoSpotifyPause](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/NoSpotifyPause)
  <a href="https://replugged.dev/install?identifier=lib.evelyn.NoSpotifyPause">
  <img alt="install NoSpotifyPause" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.NoSpotifyPause&query=%24.version&prefix=v&label=install">
  </a>: stops Discord from pausing your Spotify playback while in VC.
- [SpotifyListenAlong](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/SpotifyListenAlong)
  <a href="https://replugged.dev/install?identifier=lib.evelyn.SpotifyListenAlong">
  <img alt="install SpotifyListenAlong" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.SpotifyListenAlong&query=%24.version&prefix=v&label=install">
  </a>: allows you to use the "Listen along" feature without Spotify Premium, because Spotify
  Premium is not actually required
- [SpotifyModal](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/SpotifyModal)
  <a href="https://replugged.dev/install?identifier=lib.evelyn.SpotifyModal">
  <img alt="install SpotifyModal" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.SpotifyModal&query=%24.version&prefix=v&label=install">
  </a>: shows a little modal on your user dock that lets you see & control what you're playing on
  Spotify.
- [Translator](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/Translator)
  <a href="https://replugged.dev/install?identifier=lib.evelyn.Translator">
  <img alt="install Translator" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Freplugged.dev%2Fapi%2Fv1%2Fstore%2Flib.evelyn.Translator&query=%24.version&prefix=v&label=install">
  </a>: allows you to translate messages in-app.

## List of discontinued plugins

- [Quark](https://github.com/Socketlike/replugged-plugins/blob/main/plugins/Quark)
  <a href="https://replugged.dev/install?identifier=Socketlike/replugged-plugins&id=lib.evelyn.Quark&source=github">
  <img alt="install Quark - this plugin is not approved by the Replugged team and is discontinued; use at your own risk!" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FSocketlike%2Freplugged-plugins%2Fraw%2Fmain%2Fplugins%2FQuark%2Fmanifest.json&query=%24.version&prefix=v&label=install%20(!!)&color=red">
  </a>: allows you to create persistent (runs every startup) JavaScript snippets.

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
