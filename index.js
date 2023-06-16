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
  let csvData; // Declare csvData variable

  try {
    const googleSheetURL =
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_Oq8Do15RWSHJ5kUhmRET7E5Lw7wCxOByJtmXQ-ACs4DEPZVATqi-rCwX7COgibDaI06qUnbutDP1/pub?gid=0&single=true&output=csv';
    const response = await fetch(googleSheetURL);

    csvData = await response.text();
  } catch (error) {
    console.error('Error fetching CSV data:', error);
    res.status(500).json({ error: 'Failed to fetch CSV data' });
    return; // Return early if an error occurs
  }

  try {
    // Parse CSV data
    const data = parseCSV(csvData);

    const trackOrders = {
      'Studio Discography': [],
      'Live Sessions': [],
    };

    data.forEach((entry) => {
      // ...
    });

    // ...

    // Return the response
    res.status(200).json(trackOrders);
  } catch (error) {
    console.error('Error processing track data:', error);
    res.status(500).json({ error: 'Failed to process track data' });
  }
});

app.get('/test', async (req, res) => {
  res.send('Serverless function is working locally!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
