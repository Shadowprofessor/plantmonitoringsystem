const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'iothub',  // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// ThingSpeak API details
const THING_SPEAK_CHANNEL_ID = '2679947';  // Replace with your ThingSpeak Channel ID
const THING_SPEAK_READ_API_KEY = 'KR8S190NY76UDC68';  // Replace with your ThingSpeak Read API key
const THING_SPEAK_URL = `https://api.thingspeak.com/channels/${THING_SPEAK_CHANNEL_ID}/feeds.json`;

// Global status
let statusMessage = 'Waiting for data...';

// Function to fetch data from ThingSpeak
async function fetchThingSpeakData() {
  try {
    const response = await axios.get(THING_SPEAK_URL, {
      params: { api_key: THING_SPEAK_READ_API_KEY }
    });

    if (response.data.feeds) {
      console.log('Fetched Data:', response.data.feeds);
      await storeDataInDB(response.data.feeds);
      statusMessage = 'Data fetched and stored successfully.';
    } else {
      statusMessage = 'No new data found.';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    statusMessage = 'Error fetching data from ThingSpeak.';
  }
}

// Function to store data in MySQL database
async function storeDataInDB(feeds) {
  const sql = `
    INSERT INTO thingspeak_data (entry_id, created_at, field1, field2, field3, field4, location)
    VALUES ?
    ON DUPLICATE KEY UPDATE
    created_at = VALUES(created_at),
    field1 = VALUES(field1),
    field2 = VALUES(field2),
    field3 = VALUES(field3),
    field4 = VALUES(field4),
    location = VALUES(location)
  `;
  
  const values = feeds.map(feed => [
    feed.entry_id, 
    feed.created_at, 
    feed.field1, 
    feed.field2, 
    feed.field3, 
    feed.field4, 
    feed.location
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error storing data:', err);
    } else {
      console.log('Data successfully stored');
    }
  });
}

// Set an interval to automatically fetch and store data every 5 minutes (300000ms)
setInterval(fetchThingSpeakData, 300000);  // Fetch every 5 minutes

// Endpoint to get the current status
app.get('/get-status', (req, res) => {
  res.json({ message: statusMessage });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

