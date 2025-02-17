import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';

export default function VerifyPage() {
  const [nim, setNim] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVerify() {
    setLoading(true);
    setMessage('');

    // Cek apakah NIM ada di database
    const { data, error } = await supabase
      .from('nim_list')
      .select('nim, valid, vote')
      .eq('nim', nim)
      .single();

    if (error || !data) {
      setMessage('NIM tidak ditemukan. Silakan periksa kembali.');
      setLoading(false);
      return;
    }

    if (!data.valid) {
      setMessage('Tunggu, admin akan memvalidasi Anda.');
      setLoading(false);
      return;
    }

    if (data.vote) {
      setMessage('Anda sudah menggunakan suara.');
      setLoading(false);
      return;
    }

    // Jika valid = true dan vote = false, maka redirect ke halaman voting
    setMessage('Verifikasi berhasil! Mengarahkan ke halaman voting...');
    setTimeout(() => {
      router.push('/voting');
    }, 2000);

    setLoading(false);
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg text-center w-96'>
        <h1 className='text-xl font-bold mb-4 text-gray-700'>Verifikasi NIM</h1>
        <input
          type='text'
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder='Masukkan NIM'
          className='w-full p-2 border rounded-lg mb-4 text-gray-700'
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className='w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600'>
          {loading ? 'Memeriksa...' : 'Verifikasi'}
        </button>
        {message && <p className='mt-4 text-red-500'>{message}</p>}
      </div>
    </div>
  );
}
