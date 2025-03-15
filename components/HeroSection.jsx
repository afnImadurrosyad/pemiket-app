import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const targetDate = new Date('2025-03-17T16:48:00').getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());
  const [isSticky, setIsSticky] = useState(false);
  const [hideOnFooter, setHideOnFooter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setTimeLeft(targetDate - now);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // **Tombol muncul setelah melewati "home" dan hilang saat mencapai footer**
        setIsSticky(window.scrollY > 100);
        setHideOnFooter(footerRect.top < windowHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Konversi timeLeft ke hari, jam, menit, detik
  const formatTime = (time) => {
    if (time <= 0) return 'Voting Sudah Dibuka!';
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${days} Hari ${hours} Jam ${minutes} menit`;
  };

  // **Split Text into Words** (untuk animasi per kata)
  const sentence1 = 'Selamat Datang di Bumi Ketupat'.split(' ');
  const sentence2 =
    'Platform informasi resmi untuk milih Ketang dua empat.'.split(' ');

  return (
    <section
      id='home'
      className='h-screen flex flex-col items-center z-30 justify-center text-center text-green-700'>
      <div className='mx-4'>
        {/* Animasi Per Kata untuk Judul */}
        <h1 className='text-4xl md:text-6xl font-bold flex flex-wrap justify-center'>
          {sentence1.map((word, index) => (
            <motion.span
              key={index}
              className='mr-2'
              initial={{ opacity: 0, y: 30, scale: 1.2, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{
                ease: 'easeOut',
                duration: 0.5,
                delay: index * 0.2, // **Delay antar kata**
              }}>
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Animasi Per Kata untuk Deskripsi */}
        <p className='text-base md:text-xl mt-4 flex flex-wrap justify-center'>
          {sentence2.map((word, index) => (
            <motion.span
              key={index}
              className='mr-2'
              initial={{ opacity: 0, y: 70, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                ease: 'easeOut',
                duration: 0.5,
                delay: index * 0.2, // **Lebih cepat dari judul**
              }}>
              {word}
            </motion.span>
          ))}
        </p>

        {/* Countdown Timer */}
        <motion.div
          className='flex items-center justify-center'
          initial={{ opacity: 0, scale: 0, rotate: 40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            ease: 'easeOut',
            duration: 1,
            type: 'spring',
            delay: 2,
          }}>
          <div className='bg-green-500/60 backdrop-blur-md shadow-lg border border-white/40 z-40 p-4 rounded-lg mt-4'>
            {timeLeft > 0 ? (
              <div className='text-sm font-bold text-red-600'>
                <p>Voting akan dibuka dalam :</p>
                {formatTime(timeLeft)}
              </div>
            ) : (
              <div className='text-xl font-bold text-green-700'>
                Voting Sudah Dibuka!
              </div>
            )}

            {/* Tombol Voting */}
            <a
              href={timeLeft > 0 ? '#' : '/voting'}
              className={`mt-2 inline-block py-3 px-12 rounded-lg font-bold transition ${
                timeLeft > 0
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
              onClick={(e) => timeLeft > 0 && e.preventDefault()}>
              Mulai Voting
            </a>
          </div>
        </motion.div>
      </div>

      {/* Sticky Countdown + Tombol Voting */}
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-2 w-fit rounded-xl text-center transition-opacity duration-300 ${
          isSticky && !hideOnFooter ? 'opacity-100' : 'opacity-0'
        } bg-white/20 backdrop-blur-md shadow-lg border border-white/40 z-40`}>
        {timeLeft > 0 ? (
          <div className='text-sm font-bold text-red-600'>
            {formatTime(timeLeft)}
          </div>
        ) : (
          <div className='text-base font-bold text-green-600'>
            Voting Sudah Dibuka!
          </div>
        )}

        <a
          href={timeLeft > 0 ? '#' : '/voting'}
          className={`w-fit inline-block py-2 px-2 text-sm rounded-lg font-bold transition ${
            timeLeft > 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
          onClick={(e) => timeLeft > 0 && e.preventDefault()}>
          Mulai Voting
        </a>
      </div>
    </section>
  );
}
