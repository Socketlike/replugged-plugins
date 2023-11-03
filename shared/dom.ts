export const mergeClassNames = (...classes: string[]): string =>
  classes.filter((className: string) => Boolean(className.trim())).join(' ');

export const toggleClassName = (element: HTMLElement, className: string, to?: boolean): void => {
  if (typeof to !== 'boolean' || element.classList.contains(className) !== to)
    element.classList.toggle(className);
};
