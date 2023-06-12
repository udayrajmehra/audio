const fetch = require('node-fetch');
const Papa = require('papaparse');

function parseCSV(csvData) {
    const parsedData = Papa.parse(csvData, { header: true }).data;
    return parsedData;
  }

exports.handler = async (event, context) => {
  try {
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Oq8Do15RWSHJ5kUhmRET7E5Lw7wCxOByJtmXQ-ACs4DEPZVATqi-rCwX7COgibDaI06qUnbutDP1/pub?gid=0&single=true&output=csv';
    const response = await fetch(googleSheetURL);
    const csvData = await response.text();

    // Parse CSV data
    const data = parseCSV(csvData);

    const trackOrders = {
      'Studio Discography': [],
      'Live Sessions': []
    };

    data.forEach(entry => {
      const trackName = entry.trackname;
      const metadata = entry.metadata;
      const spotifyURI = entry.spotifyuri;
      const youtubeTrackID = entry.youtubetrackid;
      const sectionPlacement = entry.sectionplacement;
      const order = parseInt(entry.order);
      const recorded = entry.recorded === 'True';
      const mixed = entry.mixed === 'True';
      const mastered = entry.mastered === 'True';

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
