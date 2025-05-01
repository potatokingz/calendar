import axios from 'axios';

const BIN_ID = '68135a788a456b7966953ee7';  // Your actual Bin ID
const API_KEY = '$2a$10$ACr.6duTvcT6konafWW7L.5c7GN7lfiy7JdMZ78Xa6p78RwRcAf16';  // Your actual X-Master-Key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;

    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'Липсват задължителни полета.' });
    }

    const newEntry = { name, start, end, reason };

    try {
      // Retrieve existing data
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      const data = response.data.record.vacations || [];
      data.push(newEntry);

      // Update the JSONBin with the new data
      await axios.put(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        { record: { vacations: data } },
        {
          headers: {
            'X-Master-Key': API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      res.status(200).json({ message: 'Отпуската е добавена успешно.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Грешка при записване в JSONBin.' });
    }
  } else {
    res.status(405).json({ error: 'Методът не е позволен.' });
  }
}
