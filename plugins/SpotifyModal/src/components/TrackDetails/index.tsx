import { React } from 'replugged/common';

import { Artist, default as Artists } from './Artists';
import Title from './Title';
import CoverArt from './CoverArt';

export default (props: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull): JSX.Element => {
  return (
    <div className='track-details'>
      <CoverArt {...props} />
      <div className='title-artists'>
        <Title {...props} />
        <Artists {...props} />
      </div>
    </div>
  );
};

export { Artists, Artist, CoverArt, Title };
