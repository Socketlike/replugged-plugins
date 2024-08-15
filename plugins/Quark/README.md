<p>
  <h1 align="center">Quark</h1>
</p>

> [!WARNING]
> This plugin is now discontinued. I will not provide any further updates to this plugin.
> It will still remain on this repository, should anyone need to fork it.

<p align="center">
  <a href="https://replugged.dev/install?identifier=Socketlike/replugged-plugins&id=lib.evelyn.Quark&source=github">
    <img alt="install - this plugin is not approved by the Replugged team and is discontinued; use at your own risk!" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FSocketlike%2Freplugged-plugins%2Fraw%2Fmain%2Fplugins%2FQuark%2Fmanifest.json&query=%24.version&prefix=v&label=Install%20(!!)&style=for-the-badge&color=red">
  </a>
</p>

<p align="center">
  a Replugged plugin that allows you to create persistent (runs every startup) JavaScript snippets.
</p>

## Why isn't this on the Replugged plugin store yet?

This plugin is a gigantic security flaw. This plugin's existence is already a CVE for the client
mod. Still confused? Let me enlighten you:

- Because all snippets are stored using Replugged's settings system, and due to the nature of how
  Replugged's settings system works, basically _any_ plugins (including malicious plugins) can
  create it's own persistent JavaScript snippet by using this plugin if _it wants to_.
  - Any plugin can access and modify any settings namespace, which means _any plugin can access and
    modify any other plugin's settings_.
- This plugin has no checks against unauthorized modification of snippet code and will never have
  any.
  - Technically it is _possible_ to create a hashing system that verifies the integrity of the
    snippets and basically guard them from unauthorized modification but _where_ the hell am I going
    to store them?
    - _`localstorage`_? No. It has no protection from external modifications.
    - _`indexeddb`_? No. Even if there is an encryption method for _`indexeddb`_, I would still
      _need to store the decryption credentials in plain text to be able to decrypt the DB_. That is
      more ridiculous than just using `localstorage` in the first place.
  - Even if I ended up figuring out where I could store the hashes safely from any external
    modification then why would I need a hashing system? Just _store the damn snippets there!_

## Configuration

You can add / remove / edit snippets in the plugin's settings menu. It cannot get any easier than
that.

## Closure

The scripts' closure is `window`. There are no restrains on what can be accessed.
