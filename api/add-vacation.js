// Temporary storage (in-memory, resets on every Vercel restart)
let vacations = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, start, end, reason } = req.body;

    if (!name || !start || !end || !reason) {
      return res.status(400).json({ error: 'Липсват задължителни полета.' });
    }

    vacations.push({ name, start, end, reason });
    res.status(200).json({ message: 'Отпуската е добавена успешно.' });
  } else {
    res.status(405).json({ error: 'Методът не е позволен.' });
  }
}

// Export the vacations array for access from other routes
export { vacations };
