export const mergeClassNames = (...classes: unknown[]): string =>
  (classes.filter((className: unknown): boolean => typeof className === 'string') as string[])
    .filter((className: string) => Boolean(className.trim()))
    .join(' ');

export const toggleClassName = (element: HTMLElement, className: string, to?: boolean): void => {
  if (typeof to !== 'boolean' || element.classList.contains(className) !== to)
    element.classList.toggle(className);
};
