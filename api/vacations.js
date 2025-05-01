// /api/vacations.js
import axios from 'axios';

const DEV_API_KEY = 'Rc8fZlMwdfJSazhYQIwHvYX2BxxicvZi';  // Your Developer API Key
const USERNAME = 'potatoexploits_';  // Your Pastebin username
const PASSWORD = 'yaseneroo123456imrpo';  // Your Pastebin password

// Function to get the User API Key
async function getUserApiKey() {
  try {
    const response = await axios.post('https://pastebin.com/api/api_login.php', null, {
      params: {
        api_dev_key: DEV_API_KEY,
        api_user_name: USERNAME,
        api_user_password: PASSWORD,
      }
    });

    return response.data;  // This is your User API Key
  } catch (error) {
    console.error('Error getting User API Key:', error);
  }
}

// Function to create a new paste with vacation data
async function createPaste(userApiKey, vacationData) {
  try {
    const response = await axios.post('https://pastebin.com/api/api_post.php', null, {
      params: {
        api_dev_key: DEV_API_KEY,
        api_user_key: userApiKey,
        api_paste_data: JSON.stringify(vacationData),  // Store vacation data as a string
        api_paste_name: 'vacation_data',  // Name of the paste
        api_paste_private: 1,  // 1 = Unlisted, 2 = Private, 0 = Public
        api_paste_expire_date: 'N',  // 'N' = No expiration
      }
    });

    return response.data;  // The URL of the created paste
  } catch (error) {
    console.error('Error creating paste:', error);
  }
}

// POST Request Handler (for adding vacation data)
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;
    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newEntry = { name, start, end, reason };

    try {
      // Get the User API Key
      const userApiKey = await getUserApiKey();

      // Create a paste with vacation data
      const pasteUrl = await createPaste(userApiKey, newEntry);

      // Return success response with the Paste URL
      res.status(200).json({ message: 'Vacation added successfully!', pasteUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to store vacation data.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
