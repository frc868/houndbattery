'use client'; // To indicate the component is client-side rendered

import React, { useState, useEffect } from 'react';
import './styles.css'; // Correct the import path to the CSS file
import BatteryCycleChart from './BatteryCycleChart'; // Import the BatteryCycleChart component

// Define the type for the battery objects
interface Battery {
  id: number;
  name: string;
  name2: string;
  status: string;
  lastCheckedIn?: string;
  cycles: number; // Ensure cycles field is included
  pluggedInTime: number; // Time in milliseconds that the battery has been plugged in
}

const BatteryScannerPage: React.FC = () => {
  const [batteryName, setBatteryName] = useState('');
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

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

    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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
          battery.name2 === updatedBattery.name2 ? updatedBattery : battery
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

  // Extract cycle counts and names for the chart
  const cycleCounts = batteries.map((battery) => battery.cycles);
  const batteryNames = batteries.map((battery) => battery.name);

  // Calculate the best battery based on the most amount of time plugged in
  const bestBattery = batteries.reduce((max, battery) => 
    battery.status === 'IN' && battery.pluggedInTime > max.pluggedInTime ? battery : max, 
    { name: '', pluggedInTime: 0 }
  ).name;

  return (
    <div className="container">
      <h1>Battery Scanner</h1>
      <h2 className="best-battery-title">Best Battery to Use</h2> {/* Add the best battery title */}
      <div>
        <h2>{currentTime.toLocaleTimeString()}</h2>
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
              <tr key={battery.id} className={battery.status === 'IN' ? 'battery-in' : 'battery-out'}>
                <td>{battery.name}</td>
                <td>{battery.status}</td>
                <td>{battery.lastCheckedIn ? new Date(battery.lastCheckedIn).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BatteryCycleChart cycles={cycleCounts} batteryNames={batteryNames} /> {/* Add the BatteryCycleChart component */}
      <div className="best-battery">
        <p className="best-battery-name">{bestBattery}</p>
      </div>
    </div>
  );
};

export default BatteryScannerPage;