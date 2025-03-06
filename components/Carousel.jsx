import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import Card from './Card';

export default function Carousel() {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % candidates.length);
      }, 5000);
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

  return (
    <section
      id='kandidat'
      className='bg-gray-100 border-y-2 border-green-500 w-full flex flex-col items-center py-6'>
      <h2 className='text-2xl font-bold text-green-700 my-4'>
        Kandidat Ketua Angkatan Algovista
      </h2>

      {/* Mode Grid (Laptop) */}
      <div className='hidden md:flex justify-center gap-6 flex-wrap w-full px-6'>
        {candidates.map((candidate) => (
          <Card key={candidate.nim} {...candidate} />
        ))}
      </div>

      {/* Mode Carousel (HP) */}
      {isMobile && (
        <div className='relative w-full flex justify-center items-center'>
          {/* Tombol Prev */}
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? candidates.length - 1 : prevIndex - 1
              )
            }
            className='absolute left-4 bg-green-300 text-green-600 bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-lg'>
            ◀
          </button>

          {/* Render Card hanya jika ada kandidat */}
          {candidates.length > 0 ? (
            <Card {...candidates[currentIndex]} />
          ) : (
            <p className='text-gray-500'>Belum ada kandidat</p>
          )}

          {/* Tombol Next */}
          <button
            onClick={() =>
              setCurrentIndex(
                (prevIndex) => (prevIndex + 1) % candidates.length
              )
            }
            className='absolute right-4 bg-green-300 text-green-600 bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow-lg'>
            ▶
          </button>
        </div>
      )}
    </section>
  );
}
