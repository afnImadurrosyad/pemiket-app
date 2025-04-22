import { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';

// Registrasi komponen ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsSection() {
  const [stats, setStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, []);

  // **Observer untuk mendeteksi apakah komponen terlihat**
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 } // 30% terlihat baru animasi muncul
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) observer.unobserve(chartRef.current);
    };
  }, []);

  async function fetchStats() {
    const { data: voteData, error: voteError } = await supabase
      .from('votes')
      .select('count');

    const { data: pemilihData, error: pemilihError } = await supabase
      .from('data_pemilih')
      .select('kelas, valid, vote');

    if (!voteError && !pemilihError) {
      const totalVotes = voteData.reduce((sum, vote) => sum + vote.count, 0);
      const totalVoters = pemilihData.length;
      const menggunakanSuara = pemilihData.filter(
        (pemilih) => pemilih.valid && pemilih.vote
      ).length;
      const persentasePartisipasi = (menggunakanSuara / totalVoters) * 100;

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

      setStats({
        totalVotes,
        totalVoters,
        menggunakanSuara,
        persentasePartisipasi,
        sebaranKelas,
      });
    }
  }

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
    <motion.div
      ref={chartRef}
      className='w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-10'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}>
      <motion.h2
        className='text-2xl font-bold text-green-700 text-center mb-6'
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        Statistik Pemilihan
      </motion.h2>

      {stats && isVisible ? (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 text-center'>
          {[
            { label: 'Suara Masuk', value: stats.totalVotes, color: '#22c55e' },
            {
              label: 'Pemilih Terdaftar',
              value: stats.totalVoters,
              text: stats.totalVoters,
              color: '#eab308',
            },
            {
              label: 'Sudah Memilih',
              value: stats.menggunakanSuara,
              text: stats.menggunakanSuara,
              color: '#3b82f6',
            },
            {
              label: 'Partisipasi',
              value: stats.persentasePartisipasi.toFixed(2) + '%',
              text: stats.persentasePartisipasi.toFixed(2) + '%',
              color: '#ef4444',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className='relative w-44 h-44 mx-auto'
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
              }}
              transition={{ duration: 0.6, delay: index * 0.2 }}>
              <Doughnut
                data={chartData(item.value, stats.totalVoters, item.color)}
                options={options}
              />
              <p
                className='absolute inset-0 flex flex-col items-center justify-center font-bold text-lg'
                style={{ color: item.color }}>
                {item.text}
                <span className='text-sm text-gray-600'>{item.label}</span>
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500'>Memuat data...</p>
      )}

      {/* Sebaran Kelas */}
      <motion.h2
        className='text-xl font-bold text-green-700 text-center mt-10'
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        Sebaran Pemilih Berdasarkan Kelas
      </motion.h2>

      {stats?.sebaranKelas?.length > 0 && isVisible ? (
        <div className='grid grid-cols-2 md:grid-cols-3'>
          {stats.sebaranKelas.map((kelas, index) => (
            <motion.div
              key={index}
              className='relative w-36 h-36 md:w-44 md:h-44 mx-auto'
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
              }}
              transition={{ duration: 0.6, delay: index * 0.2 }}>
              <Doughnut
                data={chartData(kelas.persentase, 100, '#16a34a')}
                options={{
                  ...options,
                  cutout: '90%',
                  rotation: -90,
                  circumference: 180,
                }}
              />
              <p className='absolute inset-0 flex flex-col items-center justify-center mt-10 text-green-700 font-bold text-sm'>
                <span className='text-sm text-gray-600'>{kelas.kelas}</span>
                {kelas.persentase.toFixed(1)}% ( {kelas.memilihDiKelas} org)
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 mt-4'>Memuat data kelas...</p>
      )}
    </motion.div>
  );
}
