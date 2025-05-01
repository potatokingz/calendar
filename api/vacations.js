// /api/vacations.js
import axios from 'axios';

const BIN_ID = '68135a788a456b7966953ee7'; // Your actual bin ID
const MASTER_KEY = '$2a$10$ACr.6duTvcT6konafWW7L.5c7GN7lfiy7JdMZ78Xa6p78RwRcAf16';
const ACCESS_KEY = 'vacationapi';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export default async function handler(req, res) {
  const headers = {
    'X-Master-Key': MASTER_KEY,
    'X-Access-Key': ACCESS_KEY,
  };

  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;

    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newVacation = { name, start, end, reason };

    try {
      // 1. Get existing vacations
      const response = await axios.get(API_URL, { headers });
      const existing = response.data.record.vacations || [];

      // 2. Add new vacation
      existing.push(newVacation);

      // 3. Update JSONBin
      await axios.put(
        API_URL,
        { record: { vacations: existing } },
        {
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          }
        }
      );

      return res.status(200).json({ message: 'Vacation saved successfully.' });
    } catch (err) {
      console.error('[SAVE ERROR]', err.response?.data || err.message);
      return res.status(500).json({ error: 'Failed to save to JSONBin.' });
    }
  }

  if (req.method === 'GET') {
    try {
      const response = await axios.get(API_URL, { headers });
      const vacations = response.data.record.vacations || [];
      return res.status(200).json({ vacations });
    } catch (err) {
      console.error('[LOAD ERROR]', err.response?.data || err.message);
      return res.status(500).json({ error: 'Failed to load from JSONBin.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
