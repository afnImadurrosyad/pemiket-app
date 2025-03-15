import { motion } from 'framer-motion';

export default function WinnerCard({ rank, name, nim, image, votes, size }) {
  const cardSize =
    size === 'large'
      ? 'w-40 h-40 md:w-52 md:h-52'
      : 'w-32 h-32 md:w-40 md:h-40';

  return (
    <motion.div
      className={`flex flex-col items-center shadow-lg rounded-lg p-4 pt-6 transition-all ${
        size === 'large'
          ? ' md:w-96 border-t-4 border-green-700 w-80 bg-white'
          : 'w-64 md:w-96  bg-white'
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.8 }}>
      {size === 'large' && (
        <p className='text-base text-green-800 pb-2 font-bold'>
          Ketua Angkatan terpilih
        </p>
      )}
      {/* Gambar Kandidat */}
      <img
        src={image}
        alt={name}
        className={`object-cover rounded-full ${cardSize}`}
      />

      {/* Informasi Kandidat */}
      <p className={`text-green-800 text-lg md:text-2xl font-bold mt-2`}>
        {name}
      </p>
      <p className='text-green-800 text-sm'>NIM: {nim}</p>
      <p className='md:text-lg text-sm font-semibold text-green-700'>
        🗳️ {votes} Suara
      </p>
    </motion.div>
  );
}
