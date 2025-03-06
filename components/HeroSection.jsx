export default function HeroSection() {
  return (
    <section
      id='home'
      className='relative bg-green-200 h-screen flex items-center justify-center text-center text-green-700'>
      <div className='mx-4'>
        <h1 className='text-4xl md:text-6xl font-bold'>
          Selamat Datang di Bumi Ketupat
        </h1>
        <p className='text-lg md:text-xl mt-4'>
          Platform informasi resmi untuk milih Ketang dua empat.
        </p>
        <a
          href='/voting'
          className='mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition'>
          Mulai Voting
        </a>
      </div>
    </section>
  );
}
