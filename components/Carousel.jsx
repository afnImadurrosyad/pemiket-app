import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

export default function Carousel() {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(1); // 1 untuk next, -1 untuk prev

  // Fetch data dari Supabase
  useEffect(() => {
    async function fetchCandidates() {
      const { data, error } = await supabase
        .from('votes')
        .select('option, nim, urut, visi, misi, tanggal_lahir, image')
        .order('urut', { ascending: true });

      if (error) {
        console.error('Error fetching candidates:', error);
      } else {
        setCandidates(data);
      }
    }

    fetchCandidates();
  }, []);

  // Auto-slide hanya jika di layar HP
  useEffect(() => {
    if (isMobile && candidates.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % candidates.length);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [candidates, isMobile]);

  // Cek ukuran layar untuk mengaktifkan carousel di HP
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // **Animasi saat berpindah kandidat (Hanya untuk HP)**
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <section id='kandidat' className=' w-full flex flex-col items-center py-6'>
      <motion.h2
        className='text-2xl text-center font-bold text-green-700 my-4'
        initial={{ opacity: 0, y: +50, scale: 0 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: false }}>
        Kandidat <br /> Ketua Angkatan Algovista
      </motion.h2>

      {/* Mode Grid (Laptop) dengan animasi */}
      <div className='hidden md:flex justify-center gap-6 flex-wrap w-full px-6'>
        {candidates.map((candidate, index) => (
          <motion.div
            key={candidate.nim}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            viewport={{ once: false }}>
            <Card {...candidate} />
          </motion.div>
        ))}
      </div>

      {/* Mode Carousel (HP) */}
      {isMobile && (
        <div className='relative w-full flex justify-center items-center'>
          {/* Tombol Prev */}
          <button
            onClick={() => {
              setDirection(-1);
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? candidates.length - 1 : prevIndex - 1
              );
            }}
            className='absolute left-4 bg-green-300 text-green-600 bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-lg'>
            ◀
          </button>

          {/* **Wrapper Card dengan min-height agar tidak hilang** */}
          <motion.div
            className='relative w-72 md:w-80 flex justify-center items-center'
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: false }}>
            <AnimatePresence custom={direction} mode='wait'>
              {candidates.length > 0 && (
                <motion.div
                  key={candidates[currentIndex]?.nim}
                  variants={variants}
                  initial='enter'
                  animate='center'
                  exit='exit'
                  custom={direction}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}>
                  <Card {...candidates[currentIndex]} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tombol Next */}
          <button
            onClick={() => {
              setDirection(1);
              setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % candidates.length
              );
            }}
            className='absolute right-4 bg-green-300 text-green-600 bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-lg'>
            ▶
          </button>
        </div>
      )}
    </section>
  );
}
