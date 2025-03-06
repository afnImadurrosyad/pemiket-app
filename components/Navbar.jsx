import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

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
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // Sembunyikan navbar saat scroll ke bawah
      } else {
        setShowNavbar(true); // Tampilkan navbar saat scroll ke atas
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-green-100 fixed top-0 w-full max-h-fit text-green-700 text-mds shadow-lg z-50 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className='container mx-auto px-6 py-2 flex justify-between items-center'>
        <Link href='/'>
          <img
            src='/image.png' // Ganti dengan path logo yang benar
            alt='Logo Pemiket'
            className='w-28 h-auto cursor-pointer'
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='sm:hidden block text-green-600 focus:outline-none'>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navbar Links */}
        <ul
          className={`sm:flex gap-6 absolute sm:static top-16 left-0 w-full sm:w-auto bg-green-200 sm:bg-transparent p-4 sm:p-0 transition-all ${
            isOpen ? 'block' : 'hidden'
          }`}>
          <li>
            <button
              onClick={() => scrollToSection('home')}
              className='block py-2 sm:py-0 hover:text-green-500'>
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('kandidat')}
              className='block py-2 sm:py-0 hover:text-green-500'>
              Kandidat
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('rundown')}
              className='block py-2 sm:py-0 hover:text-green-500'>
              Rundown
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('feedback')}
              className='block py-2 sm:py-0 hover:text-green-500'>
              Feedback
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
