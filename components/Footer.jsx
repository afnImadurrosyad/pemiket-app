import { motion } from 'framer-motion';
import { Instagram, Mail, Phone } from 'lucide-react'; // Tambahkan ikon WhatsApp
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id='footer' className='bg-green-900/80 text-green-200 py-8'>
      <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center'>
        {/* Bagian Kiri - Logo & Copyright */}
        <div className='text-center md:text-left mb-4 md:mb-0'>
          <motion.img
            src='/logo-footer.png'
            alt='Logo Pemiket'
            className='w-40 mx-auto md:mx-0'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <p className='mt-2 text-sm'>Informatika ITERA 2024.</p>
          <p className='mt-2 text-sm'>
            &copy; 2025 Tim IT - Bumi Ketupat. All Rights Reserved.
          </p>
        </div>

        {/* Bagian Tengah - Navigasi */}
        <nav className='flex space-x-6 text-sm md:text-base'>
          {['Home', 'Kandidat', 'Rundown', 'Feedback'].map((item, index) => (
            <motion.a
              key={index}
              href={`#${item.toLowerCase()}`}
              className='hover:text-white transition ease-out duration-300'
              whileHover={{ scale: 1.1 }}>
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Bagian Kanan - Contact & Social Media */}
        <div className='flex flex-col items-center space-y-4'>
          {/* Contact Us Title */}
          <motion.h3
            className='text-xl font-semibold'
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>
            Contact Us
          </motion.h3>

          {/* Contact Information */}
          <motion.div
            className='text-right space-y-1'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <p className='flex items-end gap-2'>
              📞 <span className='font-medium'>+6281265065664</span>
            </p>
            <p className='flex items-end gap-2'>
              📩{' '}
              <span className='font-medium'>informaticsitera24@gmail.com</span>
            </p>
          </motion.div>

          {/* Social Media Links */}
          <div className='flex space-x-4'>
            <motion.a
              href='https://www.instagram.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-2xl hover:text-white transition ease-out duration-200'
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}>
              <Instagram />
            </motion.a>

            <motion.a
              href='mailto:informaticsitera24@gmail.com'
              className='text-2xl hover:text-white transition ease-out duration-200'
              whileHover={{ scale: 1.2 }}>
              <Mail />
            </motion.a>

            {/* WhatsApp Link */}
            <motion.a
              href='https://wa.me/6285337400409'
              target='_blank'
              rel='noopener noreferrer'
              className='text-2xl hover:text-white transition ease-out duration-200'
              whileHover={{ scale: 1.2 }}>
              <Phone />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
