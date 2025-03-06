import { useState, useEffect } from 'react';

export default function HeroSection() {
  const targetDate = new Date('2025-03-17T00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setTimeLeft(targetDate - now);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
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
    // return `${days} Hari ${hours} Jam ${minutes} Menit ${seconds} Detik`;
    return `${days} Hari ${hours} Jam`;
  };

  return (
    <section
      id='home'
      className='relative bg-gray-100 h-screen flex flex-col items-center z-30 justify-center text-center text-green-700'>
      <div className='mx-4'>
        <h1 className='text-4xl md:text-6xl font-bold'>
          Selamat Datang di Bumi Ketupat
        </h1>
        <p className='text-lg md:text-xl mt-4'>
          Platform informasi resmi untuk milih Ketang dua empat.
        </p>

        {/* Countdown Timer */}
        {timeLeft > 0 ? (
          <div className='text-xl font-bold text-red-600 mt-4 z-40'>
            {formatTime(timeLeft)}
          </div>
        ) : (
          <div className='text-xl font-bold text-green-600 mt-4'>
            Voting Sudah Dibuka!
          </div>
        )}

        {/* Tombol Voting */}
        <a
          href={timeLeft > 0 ? '#' : '/voting'}
          className={`mt-6 inline-block py-3 px-6 rounded-lg font-bold transition ${
            timeLeft > 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
          onClick={(e) => timeLeft > 0 && e.preventDefault()} // Disable klik jika belum waktunya
        >
          Mulai Voting
        </a>
      </div>

      {/* Sticky Countdown + Tombol Voting */}
      <div
        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-2 w-fit rounded-xl text-center transition-opacity duration-300 ${
          isSticky ? 'opacity-100' : 'opacity-0'
        } bg-white/20 backdrop-blur-md shadow-lg border border-white/40`}>
        {/* Countdown Timer */}
        <div className='text-base font-bold text-green-900 mb-2'>
          {formatTime(timeLeft)}
        </div>

        {/* Tombol Voting */}
        <a
          href={timeLeft > 0 ? '#' : '/voting'}
          className={`w-fit inline-block py-2 px-3 rounded-lg font-bold transition ${
            timeLeft > 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
          onClick={(e) => timeLeft > 0 && e.preventDefault()} // Disable klik jika belum waktunya
        >
          Mulai Voting
        </a>
      </div>
    </section>
  );
}
