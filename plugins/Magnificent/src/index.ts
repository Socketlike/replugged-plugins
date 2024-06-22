import { Injector, Logger, common } from 'replugged';

const injector = new Injector();
const logger = Logger.plugin('Magnificent');

interface ImageDefaultChildrenProps {
  mediaLayoutType: string;
  src: string;
}

interface Image {
  defaultProps: {
    children: (props: ImageDefaultChildrenProps) => React.ReactElement;
  };
}

export const start = (): void => {
  const imageComponent = (
    common.components as typeof common.components & {
      Image: Image;
    }
  ).Image;

  if (typeof imageComponent?.defaultProps?.children === 'function')
    injector.before(
      imageComponent.defaultProps,
      'children',
      (args: [ImageDefaultChildrenProps]): [ImageDefaultChildrenProps] => {
        if (args?.[0]?.mediaLayoutType === 'STATIC')
          args[0].src = args[0].src
            .replace(/[&?]width=[0-9]+&height=[0-9]+$/, '')
            .replace('media.discordapp.net', 'cdn.discordapp.com');

        return args;
      },
    );
  else
    logger.error(
      !imageComponent
        ? 'Unable to get image component'
        : 'Expected image component but got something else',
      imageComponent,
    );
};

export const stop = (): void => injector.uninjectAll();
