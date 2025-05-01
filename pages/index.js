// /pages/index.js
import { useState } from 'react';

export default function Home() {
  const [vacationData, setVacationData] = useState({
    name: '',
    start: '',
    end: '',
    reason: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('/api/vacations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vacationData)
    });

    const result = await response.json();

    if (response.ok) {
      alert('Vacation added successfully! View it here: ' + result.pasteUrl);
    } else {
      alert('Failed to add vacation: ' + result.error);
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setVacationData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div>
      <form id="vacationForm" onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          placeholder="Name"
          required
          value={vacationData.name}
          onChange={handleChange}
        />
        <input
          type="date"
          id="start"
          placeholder="Start Date"
          required
          value={vacationData.start}
          onChange={handleChange}
        />
        <input
          type="date"
          id="end"
          placeholder="End Date"
          required
          value={vacationData.end}
          onChange={handleChange}
        />
        <input
          type="text"
          id="reason"
          placeholder="Reason for Vacation"
          required
          value={vacationData.reason}
          onChange={handleChange}
        />
        <button type="submit">Submit Vacation</button>
      </form>
    </div>
  );
}
