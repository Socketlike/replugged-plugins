import { React, toast } from 'replugged/common';

import { config } from '../../config';
import { overflowMitigation, toClassNameString } from '../../util';

export default (props: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull): JSX.Element => {
  const elementRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect((): void => overflowMitigation(elementRef.current));

  return (
    <a
      className={toClassNameString('title', typeof props.id === 'string' ? 'href' : '')}
      ref={elementRef}
      onClick={(e: React.MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof props.id === 'string')
          window.open(
            config.get('hyperlinkURI')
              ? `spotify:${props.type}:${props.id}`
              : `https://open.spotify.com/${props.type}/${props.id}`,
            '_blank',
          );
      }}
      onContextMenu={(e: React.MouseEvent) => {
        e.stopPropagation();

        if (typeof props.id === 'string') {
          window.DiscordNative.clipboard.copy(`https://open.spotify.com/${props.type}/${props.id}`);
          toast.toast('Copied track URL to clipboard', 1);
        }
      }}>
      {props.name}
    </a>
  );
};
