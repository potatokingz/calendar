import { vacations } from './add-vacation.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(vacations);
  } else {
    res.status(405).json({ error: 'Методът не е позволен.' });
  }
}
