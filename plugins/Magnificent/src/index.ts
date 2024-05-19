import { Injector, Logger, webpack } from 'replugged';

const injector = new Injector();
const logger = Logger.plugin('Magnificent');

interface ImageComponent {
  default: {
    new (): void;
    prototype: {
      render: () => React.ReactElement;
    };
  };
}

export const start = async (): Promise<void> => {
  const imageComponent = await webpack.waitForModule<ImageComponent | undefined>(
    webpack.filters.byProps('IMAGE_GIF_RE'),
  );

  if (imageComponent?.default?.prototype)
    injector.after(
      imageComponent.default.prototype,
      'render',
      (_, res: React.ReactElement<{ src: string; zoomable: boolean }>): React.ReactElement => {
        if (res?.props?.src && !res?.props?.zoomable)
          res.props.src = res.props.src
            .replace(/[&?]width=[0-9]+&height=[0-9]+$/, '')
            .replace('media.discordapp.net', 'cdn.discordapp.com');

        return res;
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
