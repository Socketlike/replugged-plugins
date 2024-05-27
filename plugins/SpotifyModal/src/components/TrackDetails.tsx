import React from 'react';

import { toast } from 'replugged/common';
import { Tooltip } from 'replugged/components';

import { mergeClassNames } from '@shared/dom';

import { ExpandCollapseButton } from './Buttons';

import { config } from '../config';
import { handleOverflow } from '../util/misc';

const handleSpotifyURLInteraction = (
  type: 'album' | 'artist' | 'show' | 'track',
  id?: string,
): {
  onContextMenu: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
} => ({
  onContextMenu: (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (id) {
      window.DiscordNative.clipboard.copy(`https://open.spotify.com/${type}/${id}`);
      toast.toast(`Copied ${type} URL to clipboard`, toast.Kind.SUCCESS);
    }
  },
  onClick: (event: React.MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (id)
      window.open(
        config.get('hyperlinkURI')
          ? `spotify:${type}:${id}`
          : `https://open.spotify.com/${type}/${id}`,
        'blank_',
      );
  },
});

export const Artists = (props: {
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull;
}): React.ReactElement => {
  const elementRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect((): void => handleOverflow(elementRef.current));

  return (
    <span className='artists' ref={elementRef}>
      {props.track.type === 'track'
        ? props.track.artists?.map?.(
            (artist: SpotifyApi.ArtistObjectSimplified, index: number): React.ReactElement => (
              <>
                <a className='artist' {...handleSpotifyURLInteraction('artist', artist.id)}>
                  {artist.name}
                </a>
                {index !== (props.track as SpotifyApi.TrackObjectFull).artists.length - 1
                  ? ', '
                  : ''}
              </>
            ),
          ) || 'None'
        : props.track.show.publisher}
    </span>
  );
};

export const CoverArt = (props: {
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}): React.ReactElement => {
  const image =
    props.track.type === 'track'
      ? props.track.album.images[0]?.url
      : props.track.show.images[0]?.url;

  return (
    <span
      key={`${props.expanded}`}
      className={mergeClassNames('cover-art-container', props.expanded && 'expanded')}>
      <Tooltip
        className='cover-art-tooltip'
        position={Tooltip.Positions.TOP}
        align={Tooltip.Aligns.CENTER}
        text={props.track.type === 'track' ? props.track.album.name : props.track.show.name}>
        <img
          className='cover-art'
          src={image}
          {...handleSpotifyURLInteraction(
            props.track.type === 'track' ? 'album' : 'show',
            (props.track.type === 'track' ? props.track.album : props.track.show)?.id,
          )}
        />
      </Tooltip>
      <Tooltip
        className={mergeClassNames('expand-collapse-button-tooltip', !image && 'hidden')}
        text={props.expanded ? 'Collapse' : 'Expand'}
        position={Tooltip.Positions.TOP}
        align={Tooltip.Aligns.CENTER}>
        <ExpandCollapseButton
          onClick={() => props.setExpanded((prev) => !prev)}
          state={props.expanded}
          disabled={!image}
        />
      </Tooltip>
    </span>
  );
};

export const Title = (props: {
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull;
}): React.ReactElement => {
  const elementRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect((): void => handleOverflow(elementRef.current));

  return (
    <a
      className={mergeClassNames('title', typeof props.track.id === 'string' && 'href')}
      ref={elementRef}
      {...handleSpotifyURLInteraction('track', props.track.id)}>
      {props.track.name || 'Unknown'}
    </a>
  );
};

export const TrackDetails = (props: {
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull;
}): React.ReactElement => {
  const hasCover = Boolean(
    props.track.type === 'track'
      ? props.track.album.images[0]?.url
      : props.track.show.images[0]?.url,
  );
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className={mergeClassNames('track-details', expanded && hasCover && 'cover-art-expanded')}>
      <CoverArt track={props.track} expanded={expanded} setExpanded={setExpanded} />
      <div className='title-artists'>
        <Title track={props.track} />
        <Artists track={props.track} />
      </div>
    </div>
  );
};
