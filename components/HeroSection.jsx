import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const targetDate = new Date('2025-03-17T16:48:00').getTime();
  const reportDate = new Date('2025-03-17T19:10:00').getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());
  const [isSticky, setIsSticky] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const [hideOnFooter, setHideOnFooter] = useState(false);

  // Countdown untuk pemilihan
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setTimeLeft(targetDate - now);
    }, 500);
    return () => clearInterval(interval);
  }, [targetDate]);

  // **Cek waktu pengumuman**
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setIsReport(now >= reportDate); // **Set TRUE saat waktu pengumuman tercapai**
    }, 500);
    return () => clearInterval(interval);
  }, [reportDate]);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        setIsSticky(window.scrollY > 100);
        setHideOnFooter(footerRect.top < windowHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format waktu countdown
  const formatTime = (time) => {
    if (time <= 0)
      return isReport ? 'Pengumuman Sudah Dimulai!' : 'Voting Sudah Dibuka!';
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} Hari ${hours} Jam ${minutes} Menit`;
  };

  // **Animasi per kata**
  const sentence1 = 'Selamat Datang di Bumi Ketupat'.split(' ');
  const sentence2 =
    'Platform informasi resmi untuk milih Ketang dua empat.'.split(' ');

  return (
    <section
      id='home'
      className='h-screen flex flex-col items-center z-30 justify-center text-center text-green-700'>
      <div className='mx-4'>
        {/* Animasi Per Kata - Judul */}
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
                delay: index * 0.2,
              }}>
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Animasi Per Kata - Deskripsi */}
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
                delay: index * 0.3,
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
                <p>
                  {isReport
                    ? 'Pengumuman akan dimulai dalam:'
                    : 'Voting akan dibuka dalam:'}
                </p>
                {formatTime(timeLeft)}
              </div>
            ) : (
              <div className='text-xl font-bold text-green-700'>
                {isReport
                  ? 'Hasil Voting Sudah keluar!'
                  : 'Voting Sudah Dibuka!'}
              </div>
            )}

            {/* Tombol Voting atau Pengumuman */}
            <a
              href={isReport ? '/hasil-voting' : timeLeft > 0 ? '#' : '/voting'}
              className={`mt-2 inline-block py-3 px-12 rounded-lg font-bold transition ${
                timeLeft > 0
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
              onClick={(e) => timeLeft > 0 && e.preventDefault()}>
              {isReport ? 'Lihat Pengumuman' : 'Mulai Voting'}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Sticky Countdown + Tombol Floating */}
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
            {isReport ? 'Hasil Voting Sudah keluar!' : 'Voting Sudah Dibuka!'}
          </div>
        )}

        {/* Tombol Floating */}
        <a
          href={isReport ? '/hasil-voting' : timeLeft > 0 ? '#' : '/voting'}
          className={`w-fit inline-block py-2 px-2 text-sm rounded-lg font-bold transition ${
            timeLeft > 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
          onClick={(e) => timeLeft > 0 && e.preventDefault()}>
          {isReport ? 'Lihat Pengumuman' : 'Mulai Voting'}
        </a>
      </div>
    </section>
  );
}
