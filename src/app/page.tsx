'use client';

import React, { useState, useEffect } from 'react';
import './styles.css'; // Make sure you use ./ NOT ../
import BatteryCycleChart from './BatteryCycleChart';

// Define the type for the battery objects
interface Battery {
  id: number;
  name: string;
  name2: string;
  status: string;
  lastCheckedIn?: string;
  cycles: number;
  pluggedInDuration: number;
}

const BatteryScannerPage: React.FC = () => {
  const [batteryName, setBatteryName] = useState('');
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: process.env.CLIENT_NAME,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
        }),
      });
      const data = await response.json();
      setToken(data.token);
    };

    const fetchBatteries = async () => {
      const response = await fetch('/api/batteries');
      const data = await response.json();
      const sortedBatteries = data.sort((a: Battery, b: Battery) => {
        const nameA = parseInt(a.name.replace(/\D/g, ''));
        const nameB = parseInt(b.name.replace(/\D/g, ''));
        return nameA - nameB;
      });
      setBatteries(sortedBatteries);
    };

    fetchToken();
    fetchBatteries();

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleScan = async () => {
    if (!batteryName) {
      alert('Please enter a battery name.');
      return;
    }

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

  const addBattery = async (name: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/battery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Battery added:', data);
    } else {
      console.log('Failed to add battery');
    }
  };

  const getBattery = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/battery/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Battery details:', data);
    } else {
      console.log('Failed to get battery details');
    }
  };

  const addBatteryLog = async (batteryId: number, voltage: number, enteredAt: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/batterylog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ batteryId, voltage, enteredAt }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Battery log added:', data);
    } else {
      console.log('Failed to add battery log');
    }
  };

  const getBatteryLog = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/batterylog/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Battery log details:', data);
    } else {
      console.log('Failed to get battery log details');
    }
  };

  const cycleCounts = batteries.map((battery) => battery.cycles);
  const batteryNames = batteries.map((battery) => battery.name);

  const now = new Date().getTime();
  const batteriesWith5PlusHours = batteries.filter(battery => {
    const timePluggedIn = battery.status === 'IN' && battery.lastCheckedIn ? now - new Date(battery.lastCheckedIn).getTime() : 0;
    return timePluggedIn >= 5 * 60 * 60 * 1000; // 5 hours in milliseconds
  });

  let bestBattery;
  if (batteriesWith5PlusHours.length > 0) {
    bestBattery = batteriesWith5PlusHours.reduce((best, battery) => {
      if (!best) return battery;
      if (battery.cycles < best.cycles) return battery;
      if (battery.cycles === best.cycles && battery.pluggedInDuration < best.pluggedInDuration) return battery;
      return best;
    }, null as Battery | null);
  } else {
    bestBattery = batteries.reduce((best, battery) => {
      if (!best) return battery;
      const timePluggedIn = battery.status === 'IN' && battery.lastCheckedIn ? now - new Date(battery.lastCheckedIn).getTime() : 0;
      const bestTimePluggedIn = best.status === 'IN' && best.lastCheckedIn ? now - new Date(best.lastCheckedIn).getTime() : 0;
      return timePluggedIn > bestTimePluggedIn ? battery : best;
    }, null as Battery | null);
  }

  const bestBatteryTimePluggedIn = bestBattery && bestBattery.lastCheckedIn
    ? Math.floor((now - new Date(bestBattery.lastCheckedIn).getTime()) / 1000)
    : 0;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="container">
      <h1>HoundBattery</h1>
      <h2 className="best-battery-title">Best Battery to Use</h2>
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
      <BatteryCycleChart cycles={cycleCounts} batteryNames={batteryNames} />
      <div className="best-battery">
        <p className="best-battery-name">{bestBattery?.name || 'N/A'}</p>
        <p className="best-battery-timer">{bestBattery ? formatTime(bestBatteryTimePluggedIn) : ''}</p>
      </div>
    </div>
  );
};

export default BatteryScannerPage;