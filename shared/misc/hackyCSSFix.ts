import { plugins } from 'replugged';
import { loadStyleSheet } from 'replugged/util';

/** @param id - plugin identifier */
export const hackyCSSFix = (id: string): HTMLLinkElement | undefined => {
  if (document.querySelector(`link[href*="${id}"]`)) return;

  const {
    manifest: { renderer },
    path,
  } = plugins.plugins.get(id);

  return loadStyleSheet(`replugged://plugin/${path}/${renderer.replace(/\.js$/, '.css')}`);
};
