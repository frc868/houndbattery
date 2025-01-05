// app/page.tsx

'use client'; // To indicate the component is client-side rendered

import React, { useState } from 'react';

const BatteryScannerPage = () => {
  const [batteryName, setBatteryName] = useState('');
  const [batteryStatus, setBatteryStatus] = useState('OUT');

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
      const updatedStatus = batteryStatus === 'OUT' ? 'IN' : 'OUT';
      setBatteryStatus(updatedStatus);
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
      <div>
        <h2>Battery Status: {batteryStatus}</h2>
      </div>
    </div>
  );
};

export default BatteryScannerPage;
