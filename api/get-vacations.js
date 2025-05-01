import axios from 'axios';

const BIN_ID = '68135a788a456b7966953ee7';  // Your actual Bin ID
const API_KEY = '$2a$10$ACr.6duTvcT6konafWW7L.5c7GN7lfiy7JdMZ78Xa6p78RwRcAf16';  // Your actual X-Master-Key

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Retrieve existing data from JSONBin
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      const vacations = response.data.record.vacations || [];
      res.status(200).json(vacations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Грешка при зареждане на данните от JSONBin.' });
    }
  } else {
    res.status(405).json({ error: 'Методът не е позволен.' });
  }
}
