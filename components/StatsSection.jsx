import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('votes').select('count');

      if (!error) {
        const totalVotes = data.reduce((sum, vote) => sum + vote.count, 0);
        const totalVoters = 100; // Misalnya ada 100 pemilih terdaftar
        const percentage = (totalVotes / totalVoters) * 100;
        setStats({ totalVotes, totalVoters, percentage });
      }
    }

    fetchStats();
  }, []);

  return (
    <div className='w-full max-w-3xl h-fit bg-white shadow-lg rounded-lg p-6 mt-10'>
      <h2 className='text-2xl font-bold text-green-700 text-center mb-4'>
        Statistik Pemilihan
      </h2>

      {stats ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
          <motion.div
            className='bg-green-100 p-4 rounded-lg'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className='text-3xl font-bold text-green-700'>
              {stats.totalVotes}
            </h3>
            <p className='text-gray-600 text-sm'>Total Suara</p>
          </motion.div>

          <motion.div
            className='bg-yellow-100 p-4 rounded-lg'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <h3 className='text-3xl font-bold text-yellow-700'>
              {stats.totalVoters}
            </h3>
            <p className='text-gray-600 text-sm'>Total Pemilih</p>
          </motion.div>

          <motion.div
            className='bg-red-100 p-4 rounded-lg'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}>
            <h3 className='text-3xl font-bold text-red-700'>
              {stats.percentage.toFixed(2)}%
            </h3>
            <p className='text-gray-600 text-sm'>Partisipasi</p>
          </motion.div>
        </div>
      ) : (
        <p className='text-center text-gray-500'>Memuat data...</p>
      )}
    </div>
  );
}
