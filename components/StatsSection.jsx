import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import supabase from '../lib/supabase';

// Registrasi komponen ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .select('count');

    const { data: pemilihData, error: pemilihError } = await supabase
      .from('data_pemilih')
      .select('kelas, valid, vote');

    if (!voteError && !pemilihError) {
      // Total suara masuk ke calon
      const totalVotes = voteData.reduce((sum, vote) => sum + vote.count, 0);

      // Total pemilih terdaftar
      const totalVoters = pemilihData.length;

      // Total pemilih yang sudah menggunakan suara (valid = true, vote = true)
      const menggunakanSuara = pemilihData.filter(
        (pemilih) => pemilih.valid && pemilih.vote
      ).length;

      // Persentase partisipasi
      const persentasePartisipasi = (menggunakanSuara / totalVoters) * 100;

      // Sebaran Kelas (Hitung berapa banyak dari setiap kelas yang sudah memilih)
      const kelasList = [
        'TPB 52',
        'TPB 53',
        'TPB 54',
        'TPB 55',
        'TPB 56',
        'TPB 57',
      ];
      const sebaranKelas = kelasList.map((kelas) => {
        const totalDiKelas = pemilihData.filter(
          (p) => p.kelas === kelas
        ).length;
        const memilihDiKelas = pemilihData.filter(
          (p) => p.kelas === kelas && p.valid && p.vote
        ).length;
        return {
          kelas,
          totalDiKelas,
          memilihDiKelas,
          persentase:
            totalDiKelas > 0 ? (memilihDiKelas / totalDiKelas) * 100 : 0,
        };
      });

      // Simpan data di state
      setStats({
        totalVotes,
        totalVoters,
        menggunakanSuara,
        persentasePartisipasi,
        sebaranKelas,
      });
    }
  }

  // Data Chart
  const chartData = (value, max, color) => ({
    datasets: [
      {
        data: [value, max - value],
        backgroundColor: [color, '#e5e7eb'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div className='w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-10'>
      <h2 className='text-2xl font-bold text-green-700 text-center mb-6'>
        Statistik Pemilihan
      </h2>

      {stats ? (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 text-center'>
          {/* Gauge Chart - Suara Masuk */}
          <div className='relative w-44 h-44 mx-auto'>
            <Doughnut
              data={chartData(stats.totalVotes, stats.totalVoters, '#22c55e')}
              options={options}
            />
            <p className='absolute inset-0 flex flex-col items-center justify-center text-green-700 font-bold text-lg'>
              {stats.totalVotes}
              <span className='text-sm text-gray-600'>Suara Masuk</span>
            </p>
          </div>

          {/* Gauge Chart - Pemilih Terdaftar */}
          <div className='relative w-44 h-44 mx-auto'>
            <Doughnut
              data={chartData(stats.totalVoters, stats.totalVoters, '#eab308')}
              options={options}
            />
            <p className='absolute inset-0 flex flex-col items-center justify-center text-yellow-700 font-bold text-lg'>
              {stats.totalVoters}
              <span className='text-sm text-gray-600'>Pemilih Terdaftar</span>
            </p>
          </div>

          {/* Gauge Chart - Sudah Menggunakan Suara */}
          <div className='relative w-44 h-44 mx-auto'>
            <Doughnut
              data={chartData(
                stats.menggunakanSuara,
                stats.totalVoters,
                '#3b82f6'
              )}
              options={options}
            />
            <p className='absolute inset-0 flex flex-col items-center justify-center text-blue-700 font-bold text-lg'>
              {stats.menggunakanSuara}
              <span className='text-sm text-gray-600'>Sudah Memilih</span>
            </p>
          </div>

          {/* Gauge Chart - Persentase Partisipasi */}
          <div className='relative w-44 h-44 mx-auto'>
            <Doughnut
              data={chartData(stats.persentasePartisipasi, 100, '#ef4444')}
              options={options}
            />
            <p className='absolute inset-0 flex flex-col items-center justify-center text-red-700 font-bold text-lg'>
              {stats.persentasePartisipasi.toFixed(2)}%
              <span className='text-sm text-gray-600'>Partisipasi</span>
            </p>
          </div>
        </div>
      ) : (
        <p className='text-center text-gray-500'>Memuat data...</p>
      )}
      {/* Sebaran Kelas */}
      <h2 className='text-xl font-bold text-green-700 text-center mt-10'>
        Sebaran Pemilih Berdasarkan Kelas
      </h2>

      {stats?.sebaranKelas?.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {stats.sebaranKelas.map((kelas, index) => (
            <div key={index} className='relative w-full max-w-xs mx-auto'>
              <Doughnut
                data={chartData(kelas.persentase, 100, '#16a34a')}
                options={{
                  ...options,
                  cutout: '90%',
                  rotation: -90,
                  circumference: 180,
                }}
              />
              <p className='absolute inset-0 flex flex-col items-center justify-center text-green-700 font-bold text-lg'>
                {kelas.persentase.toFixed(2)}%
                <span className='text-sm text-gray-600'>{kelas.kelas}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 mt-4'>Memuat data kelas...</p>
      )}
    </div>
  );
}
