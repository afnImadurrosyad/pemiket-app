import { useState } from 'react';

export default function OprecBPA() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbze4dGgAJ784SA6-0XWg4VGPj6DP-4m60FgM421yhbNDDl_TpjECljaXEu2uhOX6rhE/exec',
        {
          method: 'POST',
          body: formData,
        }
      );
      if (response.ok) {
        e.target.reset();
        alert('✅ Berhasil mengirim!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Gagal mengirim');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='relative overflow-x-hidden min-h-screen bg-gray-100 py-10'>
      <div
        className='absolute inset-0 bg-repeat bg-center'
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: '55%',
          opacity: 0.4, // Atur opacity ke 50%
        }}
      />
      <div className='relative z-10'>
        <section className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-center text-green-700 mb-6'>
            Open Registration
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block font-semibold text-green-600'>Nama</label>
              <input
                type='text'
                name='Nama'
                required
                className='input-style text-gray-500'
                placeholder='Nama Lengkap'
              />
            </div>
            <div>
              <label className='block font-semibold text-green-600'>NIM</label>
              <input
                type='text'
                name='NIM'
                required
                className='input-style text-gray-500'
                placeholder='Masukan NIM'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block font-semibold text-green-600'>
                  Kelas TPB
                </label>
                <select name='TPB' className='input-style text-gray-500'>
                  {[
                    'TPB 52',
                    'TPB 53',
                    'TPB 54',
                    'TPB 55',
                    'TPB 56',
                    'TPB 57',
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block font-semibold text-green-600'>
                  Email
                </label>
                <input
                  type='email'
                  name='Email'
                  required
                  className='input-style text-gray-500'
                  placeholder='Masukan Email'
                />
              </div>
            </div>
            <div>
              <label className='block font-semibold text-green-600'>
                Nomor Handphone
              </label>
              <input
                type='text'
                name='Handphone'
                required
                className='input-style text-gray-500'
                placeholder='Nomor Handphone'
              />
            </div>

            <div>
              <label className='block font-semibold text-green-600'>
                Jobdesk
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <select name='Divisi-1' className='input-style text-gray-500'>
                  <option hidden>Divisi 1</option>
                  <option>IT</option>
                  <option>Minat dan Bakat</option>
                  <option>Hubungan Masyarakat</option>
                  <option>Koordinasi Lapangan</option>
                  <option>Media</option>
                  <option>Keilmuan</option>
                  <option>Ketua Harian</option>
                </select>
                <select name='Divisi-2' className='input-style text-gray-500'>
                  <option hidden>Divisi 2</option>
                  <option>IT</option>
                  <option>Minat dan Bakat</option>
                  <option>Hubungan Masyarakat</option>
                  <option>Koordinasi Lapangan</option>
                  <option>Media</option>
                  <option>Keilmuan</option>
                  <option>Ketua Harian</option>
                </select>
              </div>
            </div>
            <div>
              <label className='block font-semibold text-green-600'>
                Alasan Divisi-1
              </label>
              <input
                type='text'
                name='Alasan_Divisi-1'
                required
                className='input-style text-gray-500'
                placeholder='Berikan Alasan'
              />
            </div>
            <div>
              <label className='block font-semibold text-green-600'>
                Alasan Divisi-2
              </label>
              <input
                type='text'
                name='Alasan_Divisi-2'
                required
                className='input-style text-gray-500'
                placeholder='Berikan Alasan'
              />
            </div>
            <div>
              <label className='block font-semibold text-green-600'>
                Siap di pindahkan ke divisi lain?
              </label>
              <select name='Siap' className='input-style text-gray-500'>
                <option>Setuju</option>
                <option>Tidak</option>
              </select>
            </div>
            <div className='text-center'>
              <button
                type='submit'
                className={`bg-green-600 text-white px-6 py-2 rounded-md font-semibold transition ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-700'
                }`}
                disabled={isLoading}>
                {isLoading ? 'Mengirim...' : 'Submit'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
