// pages/api/vacations.js
import axios from 'axios';

const JSONBIN_API_KEY = '$2a$10$cMF9fBW5D95eUIkajbeETePuU1zoh23GhYnsBTuhao0WwnLZ2c74m'; 
const BIN_ID = '68135a788a456b7966953ee7';
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;

    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
      // Fetch existing bin data
      const existing = await axios.get(BIN_URL, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      });

      const vacations = existing.data.record || [];

      // Add new vacation entry
      vacations.push({ name, start, end, reason });

      // Overwrite the bin with new data
      await axios.put(BIN_URL, vacations, {
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY,
          'X-Bin-Versioning': 'false'
        }
      });

      res.status(200).json({ message: 'Vacation added successfully.' });
    } catch (error) {
      console.error('JSONBin Error:', error);
      res.status(500).json({ error: 'Failed to store vacation data.' });
    }
  } else if (req.method === 'GET') {
    try {
      const response = await axios.get(BIN_URL, {
        headers: { 'X-Master-Key': JSONBIN_API_KEY }
      });

      res.status(200).json(response.data.record || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
