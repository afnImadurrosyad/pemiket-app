import { useEffect, useState } from 'react';

const feedbacks = [
  {
    name: 'Afnan Imadurrosyad',
    message: 'Acara yang luar biasa! Sangat menginspirasi dan penuh manfaat.',
    avatar: '/image/jpg/user1.jpg', // Sesuaikan dengan gambar yang tersedia
  },
  {
    name: 'Rahmatullah',
    message: 'Sangat menyenangkan bisa terlibat dalam acara ini!',
    avatar: '/image/jpg/user2.jpg',
  },
  {
    name: 'Siti Aminah',
    message: 'Saya mendapatkan banyak wawasan baru dari acara ini!',
    avatar: '/image/jpg/user3.jpg',
  },
];

export default function Feedback() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Slide otomatis setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <section className='bg-green-100 py-10'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-green-700'>Feedback Peserta</h2>
      </div>
      <div className='flex flex-col items-center'>
        <div className='relative w-full max-w-lg overflow-hidden'>
          {/* Feedback Cards */}
          <div
            className='flex transition-transform duration-500 ease-in-out'
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                className='w-full flex-shrink-0 flex flex-col items-center text-center p-6 bg-white shadow-lg rounded-lg'>
                <img
                  src={feedback.avatar}
                  alt={feedback.name}
                  className='w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-green-500'
                />
                <p className='text-gray-700 italic'>"{feedback.message}"</p>
                <h3 className='font-bold text-green-700 mt-2'>
                  - {feedback.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className='flex mt-4 space-x-2'>
          {feedbacks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-green-500 scale-110'
                  : 'bg-gray-300'
              }`}></button>
          ))}
        </div>
      </div>
    </section>
  );
}
