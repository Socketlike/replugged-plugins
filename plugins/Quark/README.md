<p>
  <h1 align="center">Quark</h1>
</p>

<p align="center">
  <a href="https://github.com/Socketlike/Quark/releases/latest">
    <img alt="latest release" src="https://img.shields.io/github/v/release/Socketlike/Quark?label=version&sort=semver">
  </a>
  <a href="https://github.com/Socketlike/Quark/actions/workflows/lint.yml">
    <img alt="lint status" src="https://img.shields.io/github/actions/workflow/status/Socketlike/Quark/lint.yml?label=lint">
  </a>
  <a href="https://github.com/Socketlike/Quark/actions/workflows/release.yml">
    <img alt="build status" src="https://img.shields.io/github/actions/workflow/status/Socketlike/Quark/release.yml?label=build">
  </a>
  <a href="https://github.com/Socketlike/Quark/actions/workflows/nightly.yml">
    <img alt="nightly status" src="https://img.shields.io/github/actions/workflow/status/Socketlike/Quark/nightly.yml?label=nightly&color=blueviolet">
  </a>
</p>

<p align="center">
  <a href="https://replugged.dev/install?identifier=Socketlike/Quark&source=github">
    <img alt="install" src="https://img.shields.io/github/v/release/Socketlike/Quark?label=Install&sort=semver&style=for-the-badge">
  </a>
</p>

<p align="center">
  a post-swc Replugged plugin that allows you to create persistent JavaScript snippets.
</p>

## Why isn't this on the Replugged plugin store yet?

This plugin is a gigantic security flaw. This plugin's existence is already a CVE for the client
mod.  
Still confused? Let me enlighten you:

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

## Scope

You can access these things from your snippets:

```ts
{
  this: window,
  quark: {
    logger: (...args: unknown[]) => void,
    storage: Map<string, unknown>, // default: ['snippetName' => <quark's name>]
  }
}
```
