const fetch = require('node-fetch');
const Papa = require('papaparse');
const express = require('express');
const cors = require('cors');

function parseCSV(csvData) {
  const parsedData = Papa.parse(csvData, { header: true }).data;
  return parsedData;
}

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const googleSheetURL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Oq8Do15RWSHJ5kUhmRET7E5Lw7wCxOByJtmXQ-ACs4DEPZVATqi-rCwX7COgibDaI06qUnbutDP1/pub?gid=0&single=true&output=csv';
    const response = await fetch(googleSheetURL);
    const csvData = await response.text();

    // Parse CSV data
    const data = parseCSV(csvData);

    console.log('Parsed Data:', data); // Debugging: Log parsed data

    const trackOrders = {
      'Studio Discography': [],
      'Live Sessions': [],
    };

    data.forEach((entry) => {
      const trackName = entry.trackName;
      const metadata = entry.metadata;
      const spotifyURI = entry.spotifyURI;
      const youtubeTrackID = entry.youtubeTrackID;
      const sectionPlacement = entry.sectionPlacement;
      const order = parseInt(entry.order);
      const recorded = entry.recorded === 'TRUE';
      const mixed = entry.mixed === 'TRUE';
      const mastered = entry.mastered === 'TRUE';

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
        mastered,
      });
    });

    Object.values(trackOrders).forEach((section) => {
      section.sort((a, b) => a.order - b.order);
    });

    // Set the response headers
    res.setHeader('Access-Control-Allow-Origin', 'https://udayrajmehra.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Return the response
    res.status(200).json(trackOrders);
  } catch (error) {
    console.error('Error fetching track data:', error);
    res.status(500).json({ error: 'Failed to fetch track data' });
  }
});

exports.handler = app;
