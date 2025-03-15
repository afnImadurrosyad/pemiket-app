import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import supabase from '../lib/supabase';

// Register Chart.js components
Chart.register(...registerables);

export default function ChartHasil() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data, error } = await supabase
      .from('votes')
      .select('option, count')
      .order('count', { ascending: false });

    if (!error && data) {
      setChartData({
        labels: data.map((vote) => vote.option), // Nama kandidat
        datasets: [
          {
            label: 'Jumlah Suara',
            data: data.map((vote) => vote.count), // Jumlah suara
            backgroundColor: ['#4CAF50', '#FFCA28', '#F44336'], // Warna kandidat
            borderColor: '#333',
            borderWidth: 1,
          },
        ],
      });
    }
  }

  return (
    <div className='w-full max-h-96 bg-white shadow-lg rounded-lg my-6 py-4 px-2 pb-16'>
      <h2 className='text-2xl font-bold text-green-700 text-center mb-4'>
        Grafik Hasil Voting
      </h2>

      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true },
            },
            animation: {
              duration: 1500,
              easing: 'easeOutBounce',
            },
            plugins: {
              tooltip: {
                enabled: true,
                mode: 'index',
              },
            },
            hover: {
              mode: 'nearest',
              animationDuration: 400,
            },
          }}
        />
      ) : (
        <p className='text-center text-gray-500'>Memuat data...</p>
      )}
    </div>
  );
}
