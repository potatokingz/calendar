// /api/vacations.js
import axios from 'axios';

const BIN_ID = '68135a788a456b7966953ee7';  // Ensure your BIN_ID is correct
const API_KEY = '$2a$10$ACr.6duTvcT6konafWW7L.5c7GN7lfiy7JdMZ78Xa6p78RwRcAf16';  // Ensure your API_KEY is correct

export default async function handler(req, res) {
  // Handle POST request
  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;

    // Check if all required fields are provided
    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'Липсват задължителни полета.' });  // Missing required fields
    }

    // Validate the date format for start and end
    if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
      return res.status(400).json({ error: 'Невалиден формат на датата.' });  // Invalid date format
    }

    const newEntry = { name, start, end, reason };

    try {
      // Fetch current data from JSONBin
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      // Ensure that we handle the case where 'vacations' might not exist
      const data = response.data.record?.vacations || [];

      // Add new vacation entry
      data.push(newEntry);

      // Update the JSONBin with the new vacation data
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

      // Success response
      res.status(200).json({ message: 'Отпуската е добавена успешно.' });  // Successfully added the vacation

    } catch (error) {
      console.error(error);  // Log the error for debugging
      res.status(500).json({ error: 'Грешка при записване в JSONBin.' });  // Error when saving to JSONBin
    }
  } 
  // Handle GET request
  else if (req.method === 'GET') {
    try {
      // Fetch the current vacation records from JSONBin
      const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });

      // Extract vacations data and send as a response
      const vacations = response.data.record?.vacations || [];
      res.status(200).json({ vacations });

    } catch (error) {
      console.error(error);  // Log the error for debugging
      res.status(500).json({ error: 'Грешка при зареждане от JSONBin.' });  // Error when fetching from JSONBin
    }
  } 
  // Handle unsupported HTTP methods
  else {
    res.status(405).json({ error: 'Методът не е позволен.' });  // Method not allowed
  }
}
