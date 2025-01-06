'use client'; // To indicate the component is client-side rendered

import React, { useState, useEffect } from 'react';

// Define the type for the battery objects
interface Battery {
  id: number;
  name: string;
  status: string;
}

const BatteryScannerPage = () => {
  const [batteryName, setBatteryName] = useState('');
  const [batteries, setBatteries] = useState<Battery[]>([]);

  useEffect(() => {
    // Fetch all batteries on component mount
    const fetchBatteries = async () => {
      const response = await fetch('/api/batteries');
      const data = await response.json();
      setBatteries(data);
    };

    fetchBatteries();
  }, []);

  const handleScan = async () => {
    if (!batteryName) {
      alert('Please enter a battery name.');
      return;
    }

    // Make a POST request to the API endpoint to toggle battery IN/OUT
    const response = await fetch('/api/toggleBattery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batteryName }),
    });

    if (response.ok) {
      const updatedBattery = await response.json();
      setBatteries((prevBatteries) =>
        prevBatteries.map((battery) =>
          battery.name === updatedBattery.name ? updatedBattery : battery
        )
      );
    } else {
      alert('Something went wrong while toggling the battery status.');
    }
  };

  return (
    <div>
      <h1>Battery Scanner</h1>
      <div>
        <input
          type="text"
          value={batteryName}
          onChange={(e) => setBatteryName(e.target.value)}
          placeholder="Enter battery name"
        />
        <button onClick={handleScan}>Scan Battery</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Battery</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {batteries.map((battery) => (
            <tr key={battery.id}>
              <td>{battery.name}</td>
              <td>{battery.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatteryScannerPage;