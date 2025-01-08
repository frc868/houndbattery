import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BatteryCycleChartProps {
  cycles: number[];
  batteryNames: string[];
}

const BatteryCycleChart: React.FC<BatteryCycleChartProps> = ({ cycles, batteryNames }) => {
  const data = {
    labels: batteryNames,
    datasets: [
      {
        label: 'Cycle Count',
        data: cycles,
        backgroundColor: 'rgba(240, 204, 48, 0.8)',
        borderColor: 'rgba(240, 204, 48, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BatteryCycleChart;