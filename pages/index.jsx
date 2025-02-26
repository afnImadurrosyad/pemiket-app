import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import style from '../styles/index.module.css';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('March 25, 2025 00:00:00').getTime();

    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(countdown);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  function goVote() {
    router.push('/voting');
  }

  return (
    <div className='min-h-fit flex flex-col bg-white'>
      <div className='head-container'>
        <div className='navbar-container'>
          <nav className='bg-blue-600 text-white p-4'>
            <div className='container mx-auto flex justify-between items-center'>
              <Link href='/' className='text-xl font-bold'>
                Awokwokwok
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='sm:hidden block text-white'>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <ul
                className={`sm:flex gap-6 absolute sm:static top-16 left-0 w-full sm:w-auto bg-blue-600 sm:bg-transparent p-4 sm:p-0 ${
                  isOpen ? 'block' : 'hidden'
                }`}>
                <li>
                  <Link href='/' className='block py-2 sm:py-0'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href='/about' className='block py-2 sm:py-0'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href='/services' className='block py-2 sm:py-0'>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href='/contact' className='block py-2 sm:py-0'>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className='min-h-screen flex flex-col items-center justify-center'>
          <div className='min-w-screen flex flex-col justify-center items-center text-8xl font-bold text-green-900 font-serif'>
            <p>BUMI</p>
            <p>KETUPAT</p>
          </div>
          <div className='countdown text-4xl text-green-900 mt-10'>
            <p>
              {timeLeft.days} Days {timeLeft.hours} Hours {timeLeft.minutes}{' '}
              Minutes {timeLeft.seconds} Seconds
            </p>
          </div>
          <button
            onClick={goVote}
            className='bg-green-500 text-white p-2 rounded-lg mt-4'>
            Vote Now!
          </button>
        </div>
        <div></div>
      </div>
      <div className='body-container m in-h-screen'></div>
    </div>
  );
}
