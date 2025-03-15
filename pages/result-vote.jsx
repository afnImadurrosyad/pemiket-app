import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import supabase from '../lib/supabase';
import Countdown from '../components/Countdown';
import WinnerCard from '../components/WinnerCard';
import StatsSection from '../components/StatsSection';
import ChartHasil from '@/components/ChartHasil';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function HasilVoting() {
  const [showCountdown, setShowCountdown] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isReport, setIsReport] = useState();
  const [winners, setWinners] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchStatus();
    if (!isReport) {
      setTimeout(() => {
        toast.error('Anda tidak memiliki izin untuk mengakses ini');
        router.push('./');
      }, 500);
    }

    if (showResults) {
      fetchWinners();
    }
  }, [showResults]);

  async function fetchStatus() {
    const { data, error } = await supabase
      .from('stat-test')
      .select('status')
      .eq('name, report');

    if (!error) setIsReport(data);
  }

  async function fetchWinners() {
    const { data, error } = await supabase
      .from('votes')
      .select('option, nim, image, count')
      .order('count', { ascending: false })
      .limit(3);

    if (!error) setWinners(data);
  }

  return (
    <div className='relative min-h-screen flex flex-col justify-center items-center bg-gray-100'>
      {showResults && <Navbar />}
      <div
        className='absolute inset-0 bg-repeat bg-center'
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: '55%',
          opacity: 0.4, // Atur opacity ke 50%
        }}
      />
      <div className='z-10 mt-10 md:mt-0 flex flex-col justify-center items-center w-sc'>
        {!showCountdown && !showResults && (
          <motion.button
            className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg'
            onClick={() => setShowCountdown(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}>
            Lihat Hasil
          </motion.button>
        )}

        {showCountdown && !showResults && (
          <Countdown onFinish={() => setShowResults(true)} />
        )}

        {showResults && winners.length > 0 && (
          <>
            {/* Grid Winner untuk Laptop */}
            <motion.div
              className='hidden md:flex h-screen marker:justify-center items-center gap-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1 } }}>
              {/* Kandidat Peringkat 2 */}
              {winners[1] && (
                <WinnerCard
                  key={winners[1].nim}
                  rank={2}
                  name={winners[1].option}
                  nim={winners[1].nim}
                  image={winners[1].image}
                  votes={winners[1].count}
                  size='medium'
                />
              )}

              {/* Kandidat Peringkat 1 (Tengah & Lebih Besar) */}
              {winners[0] && (
                <WinnerCard
                  key={winners[0].nim}
                  rank={1}
                  name={winners[0].option}
                  nim={winners[0].nim}
                  image={winners[0].image}
                  votes={winners[0].count}
                  size='large'
                />
              )}

              {/* Kandidat Peringkat 3 */}
              {winners[2] && (
                <WinnerCard
                  key={winners[2].nim}
                  rank={3}
                  name={winners[2].option}
                  nim={winners[2].nim}
                  image={winners[2].image}
                  votes={winners[2].count}
                  size='medium'
                />
              )}
            </motion.div>

            {/* Grid Winner untuk HP (Vertikal) */}
            <motion.div
              className='flex md:hidden flex-col items-center gap-6 mt-8'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1 } }}>
              {winners.map((winner, index) => (
                <WinnerCard
                  key={winner.nim}
                  rank={index + 1}
                  name={winner.option}
                  nim={winner.nim}
                  image={winner.image}
                  votes={winner.count}
                  size={index === 0 ? 'large' : 'medium'}
                />
              ))}
            </motion.div>

            {/* Statistik & Grafik */}
            <div className='w-fit max-w-4xl h-max mt-10'>
              <StatsSection />
              <ChartHasil />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
