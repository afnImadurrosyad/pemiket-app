import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  Users,
  CheckCircle,
  Utensils,
  Trophy,
  Flag,
} from 'lucide-react';

const rundown = [
  { time: '14:30', title: 'Pembukaan', icon: CalendarClock },
  { time: '15:11', title: 'Penyampaian Visi Misi', icon: Users },
  { time: '15:52', title: 'Diskusi Publik', icon: Users },
  { time: '16:48', title: 'Pemilihan Ketua', icon: CheckCircle },
  { time: '18:08', title: 'Buka Bersama', icon: Utensils },
  { time: '19:08', title: 'Pengumuman Ketua', icon: Trophy },
  { time: '19:33', title: 'Penutupan & Dokumentasi', icon: Flag },
];

export default function Rundown() {
  const [isMobile, setIsMobile] = useState(false);

  // Cek ukuran layar untuk menentukan tampilan HP atau Laptop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id='rundown' className='py-10 px-6'>
      <motion.h2
        className='text-2xl md:text-3xl font-bold text-green-700 text-center mb-10'
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        Rundown Acara
      </motion.h2>

      {/* Timeline Container */}
      <div className='relative flex flex-col items-center w-full max-w-3xl mx-auto'>
        {/* Garis Tengah (Hanya di Laptop) */}
        <div className='absolute top-0 bottom-0 left-1/2 w-1 bg-green-500 transform -translate-x-1/2'></div>

        {rundown.map((event, index) => {
          const IconComponent = event.icon;
          return (
            <motion.div
              key={event.time}
              className={`relative flex items-center w-full my-6 group ${
                index % 2 === 0
                  ? 'justify-start pr-6 md:pr-10'
                  : 'justify-end pl-6 md:pl-10'
              }`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}>
              {/* Titik Poin di Garis Tengah (Hanya di Laptop) */}
              {!isMobile && (
                <div className='absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-2 border-green-700 rounded-full transition-all duration-300 group-hover:bg-green-700 group-hover:scale-125'></div>
              )}

              {/* Box Rundown */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`bg-white shadow-lg border-2 border-green-500 px-4 md:px-6 py-3 md:py-4 rounded-lg ${
                  isMobile ? 'w-64 text-sm' : 'w-72 md:w-80 text-md'
                } flex items-center gap-3 md:gap-4 ${
                  index % 2 === 0 ? 'text-left' : 'text-right flex-row-reverse'
                }`}>
                {/* Animasi Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className='bg-green-100 p-2 rounded-full border border-green-500'>
                  <IconComponent
                    className={`w-5 h-5 md:w-6 md:h-6 text-green-700`}
                  />
                </motion.div>

                {/* Teks */}
                <div>
                  <h3 className='font-semibold text-green-700'>
                    {event.title}
                  </h3>
                  <p className='text-gray-600'>{event.time}</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
