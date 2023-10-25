import { common } from 'replugged';
import { config, _logger } from '@util';
import { loadAll, startAll, stopAll } from '@quark';
import './style.css';

const { fluxDispatcher, toast } = common;

const askUserKindlyToMigrateFromScripts = (): void => {
  toast.toast(
    'Your Quarks configuration needs updating. Open console for more details.',
    toast.Kind.FAILURE,
  );
  _logger.error(
    `In order to continue using your old snippets, you need to migrate your old snippets from the old "scripts" settings key to the new "quarks" settings key.
    To do this, execute
    replugged.plugins.getExports('lib.evelyn.Quark').config.set(
      'quarks',
      replugged.plugins.getExports('lib.evelyn.Quark').config.get('scripts').reduce(
        (a, { enabled, name, start, stop }) => { a[name] = { enabled, start, stop }; return a },
        {},
      )
    );
    replugged.plugins.getExports('lib.evelyn.Quark').config.delete('scripts');
    replugged.plugins.getExports('lib.evelyn.Quark').quark.loadAll();
    replugged.plugins.getExports('lib.evelyn.Quark').quark.startAll();
    `,
  );

  fluxDispatcher.unsubscribe('POST_CONNECTION_OPEN', askUserKindlyToMigrateFromScripts);
};

export const start = (): void => {
  // @ts-expect-error - migration
  if (config.get('scripts')) {
    if (document.querySelector('[class^=panels-]')) askUserKindlyToMigrateFromScripts();
    else fluxDispatcher.subscribe('POST_CONNECTION_OPEN', askUserKindlyToMigrateFromScripts);
  }

  loadAll();
  startAll();
};

export const stop = (): void => stopAll();

export { Settings, Editor, openEditor } from '@components';
export { config } from '@util';
export * as quark from '@quark';
