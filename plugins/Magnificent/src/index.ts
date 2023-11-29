import { Injector, Logger, util, webpack } from 'replugged';

const injector = new Injector();
const logger = Logger.plugin('Magnificent');

interface ImageComponent {
  (): void;
  prototype: {
    render: () => React.ReactElement;
  };
}

export const start = async (): Promise<void> => {
  const imageComponent = await webpack.waitForModule<ImageComponent | undefined>(
    webpack.filters.bySource('showThumbhashPlaceholder:'),
  );

  if (imageComponent?.prototype)
    injector.after(
      imageComponent.prototype,
      'render',
      (_, res: React.ReactElement): React.ReactElement => {
        // fail fast if image component is rendered as an embed
        let isEmbed = false;

        const image = util.findInReactTree(res as unknown as util.Tree, (_): boolean => {
          const element = _ as unknown as React.ReactElement;

          if (element?.props?.className?.match?.(/clickable_/)) isEmbed = true;

          return (element?.type === 'img' && typeof element?.props?.src === 'string') || isEmbed;
        }) as unknown as React.ReactElement;

        if (image && !isEmbed)
          image.props.src = image.props.src
            .replace(/\?width=[0-9]+&height=[0-9]+$/, '')
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
