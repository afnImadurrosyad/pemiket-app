import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Fungsi Scroll ke Section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle Hide & Show Navbar on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY <= lastScrollY);
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='bg-green-100 fixed top-0 w-full text-green-700 text-md shadow-lg z-50'>
      <div className='container mx-auto px-6 py-2 flex justify-between items-center'>
        <Link href='/'>
          <img
            src='/image.png'
            alt='Logo Pemiket'
            className='w-28 h-auto cursor-pointer'
          />
        </Link>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className='sm:hidden block text-green-600 focus:outline-none'
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Navbar Links (Desktop) */}
        <ul className='hidden sm:flex gap-6'>
          {['home', 'kandidat', 'rundown', 'feedback'].map((item) => (
            <li key={item} className='relative group overflow-hidden'>
              <button
                onClick={() => scrollToSection(item)}
                className='block py-2 sm:py-0 hover:text-green-500 transition relative'>
                {item.charAt(0).toUpperCase() + item.slice(1)}
                {/* Garis Bawah Animasi saat Hover */}
                <motion.div className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0' />
              </button>
            </li>
          ))}
        </ul>

        {/* Navbar Links (Mobile) */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className='sm:hidden absolute top-16 left-0 w-full bg-green-200 p-4'>
              {['home', 'kandidat', 'rundown', 'feedback'].map((item) => (
                <li key={item} className='relative group overflow-hidden'>
                  <button
                    onClick={() => {
                      scrollToSection(item);
                      setIsOpen(false);
                    }}
                    className='block py-2 hover:text-green-500 w-full text-left transition relative'>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    {/* Garis Bawah Animasi saat Hover */}
                    <motion.div className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full group-hover:left-0' />
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
