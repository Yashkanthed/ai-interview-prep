import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { formatDate } from '../../utils/formatters.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ProgressChart({ sessions }) {
  const completed = sessions?.filter((s) => s.averageScore != null) || [];

  const data = {
    labels: completed.map((s) => formatDate(s.createdAt)),
    datasets: [
      {
        label: 'Average Score',
        data: completed.map((s) => s.averageScore),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.3
      }
    ]
  };

  const options = {
    scales: {
      y: { min: 0, max: 10, ticks: { stepSize: 1 } }
    }
  };

  if (!completed.length) return <p>Complete a few interviews to see your progress trend.</p>;

  return <Line data={data} options={options} />;
}
