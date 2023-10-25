import { React } from 'replugged/common';

import Title from './Title';
import CoverArt from './CoverArt';
import Artists from './Artists';

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

export { Artist } from './Artists';
export { Artists, CoverArt, Title };
