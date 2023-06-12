const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Oq8Do15RWSHJ5kUhmRET7E5Lw7wCxOByJtmXQ-ACs4DEPZVATqi-rCwX7COgibDaI06qUnbutDP1/pub?gid=0&single=true&output=csv';
    const response = await fetch(googleSheetURL);
    const data = await response.json();
    const entries = data.feed.entry;

    const trackOrders = {
      'Studio Discography': [],
      'Live Sessions': []
    };

    entries.forEach(entry => {
      const trackName = entry.gsx$trackname.$t;
      const metadata = entry.gsx$metadata.$t;
      const spotifyURI = entry.gsx$spotifyuri.$t;
      const youtubeTrackID = entry.gsx$youtubetrackid.$t;
      const sectionPlacement = entry.gsx$sectionplacement.$t;
      const order = parseInt(entry.gsx$order.$t);
      const recorded = entry.gsx$recorded.$t === 'True';
      const mixed = entry.gsx$mixed.$t === 'True';
      const mastered = entry.gsx$mastered.$t === 'True';

      if (spotifyURI === 'null' && youtubeTrackID === 'null') {
        return;
      }

      trackOrders[sectionPlacement].push({
        order,
        trackName,
        metadata,
        spotifyURI,
        youtubeTrackID,
        recorded,
        mixed,
        mastered
      });
    });

    Object.values(trackOrders).forEach(section => {
      section.sort((a, b) => a.order - b.order);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(trackOrders),
    };
  } catch (error) {
    console.error('Error fetching track data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch track data' }),
    };
  }
};
