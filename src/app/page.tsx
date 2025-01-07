'use client'; // To indicate the component is client-side rendered

import React, { useState, useEffect } from 'react';
import './styles.css'; // Correct the import path to the CSS file

// Define the type for the battery objects
interface Battery {
  id: number;
  name: string;
  status: string;
  lastCheckedIn?: string;
}

const BatteryScannerPage: React.FC = () => {
  const [batteryName, setBatteryName] = useState('');
  const [batteries, setBatteries] = useState<Battery[]>([]);

  useEffect(() => {
    // Fetch all batteries on component mount
    const fetchBatteries = async () => {
      const response = await fetch('/api/batteries');
      const data = await response.json();
      // Sort batteries numerically based on their names
      const sortedBatteries = data.sort((a: Battery, b: Battery) => {
        const nameA = parseInt(a.name.replace(/\D/g, ''));
        const nameB = parseInt(b.name.replace(/\D/g, ''));
        return nameA - nameB;
      });
      setBatteries(sortedBatteries);
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
      setBatteries((prevBatteries) => {
        const updatedBatteries = prevBatteries.map((battery) =>
          battery.name === updatedBattery.name ? updatedBattery : battery
        );
        // Sort batteries numerically based on their names
        return updatedBatteries.sort((a, b) => {
          const nameA = parseInt(a.name.replace(/\D/g, ''));
          const nameB = parseInt(b.name.replace(/\D/g, ''));
          return nameA - nameB;
        });
      });
      setBatteryName(''); // Clear the search bar
    } else {
      alert('Something went wrong while toggling the battery status.');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <div className="container">
      <h1>Battery Scanner</h1>
      <div>
        <input
          type="text"
          value={batteryName}
          onChange={(e) => setBatteryName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter battery name"
        />
      </div>
      <div className="table-container">
        <table className="battery-table">
          <thead>
            <tr>
              <th>Battery</th>
              <th>Status</th>
              <th>Last Checked In</th>
            </tr>
          </thead>
          <tbody>
            {batteries.map((battery) => (
              <tr key={battery.id}>
                <td>{battery.name}</td>
                <td>{battery.status}</td>
                <td>{battery.lastCheckedIn ? new Date(battery.lastCheckedIn).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatteryScannerPage;