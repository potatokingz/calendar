import axios from 'axios';

const BIN_ID = '68135a788a456b7966953ee7';
const API_KEY = '$2a$10$ACr.6duTvcT6konafWW7L.5c7GN7lfiy7JdMZ78Xa6p78RwRcAf16';
const ACCESS_KEY = '$2a$10$cMF9fBW5D95eUIkajbeETePuU1zoh23GhYnsBTuhao0WwnLZ2c74m';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;

    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newEntry = { name, start, end, reason };

    try {
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY,
          'X-Access-Key': ACCESS_KEY
        }
      });

      const data = response.data.record.vacations || [];
      data.push(newEntry);

      await axios.put(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        { record: { vacations: data } },
        {
          headers: {
            'X-Master-Key': API_KEY,
            'X-Access-Key': ACCESS_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      res.status(200).json({ message: 'Vacation added successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error writing to JSONBin.' });
    }
  } else if (req.method === 'GET') {
    try {
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': API_KEY,
          'X-Access-Key': ACCESS_KEY
        }
      });

      const vacations = response.data.record.vacations || [];
      res.status(200).json({ vacations });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error loading from JSONBin.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
