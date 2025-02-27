import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

export default function VerifyPage() {
  const [nim, setNim] = useState('');
  const [nama, setNama] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleVerify() {
    setLoading(true);

    const { data, error } = await supabase
      .from('data_pemilih')
      .select('nim, nama, valid, vote, wait')
      .eq('nim', nim)
      .ilike('nama', nama)
      .single();

    if (error || !data) {
      toast.error('NIM atau nama tidak ditemukan!');
      setLoading(false);
      return;
    }

    if (!data.valid) {
      if (!data.wait) {
        await supabase
          .from('data_pemilih')
          .update({ wait: true })
          .eq('nim', nim);
        toast.success('Permintaan validasi dikirim!');
      } else {
        toast('Permintaan validasi sudah dikirim, harap tunggu.', {
          icon: '⏳',
        });
      }
      setLoading(false);
      return;
    }

    if (data.vote) {
      toast.error('Anda sudah menggunakan suara!');
      setLoading(false);
      return;
    }

    // ✅ Simpan data user di Local Storage agar halaman voting bisa mengaksesnya
    localStorage.setItem('user', JSON.stringify(data));

    toast.success('Verifikasi berhasil! Mengarahkan ke voting...');
    setTimeout(() => {
      router.push('/voting');
    }, 2000);
    setLoading(false);
  }

  useEffect(() => {
    if (!nim) return;

    //  Supabase Realtime Listener
    const subscription = supabase
      .channel('realtime verify')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'data_pemilih' },
        (payload) => {
          if (payload.new.nim === nim && payload.new.valid) {
            toast.success(
              'Akun Anda sudah diverifikasi! Mengarahkan ke voting...'
            );
            // Simpan ke Local Storage agar bisa diakses oleh halaman voting
            localStorage.setItem('user', JSON.stringify(payload.new));

            setTimeout(() => {
              router.push('/voting');
            }, 2000);
          }
          console.log('Payload:', payload);
          handleVerify();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [nim, router]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg text-center w-96 -mx-4 border-t-4 border-green-400'>
        <h1 className='text-xl font-bold mb-4 text-gray-700'>Verifikasi NIM</h1>

        <input
          type='text'
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder='Masukkan Nama'
          className='w-full p-2 border rounded-lg mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400'
        />

        <input
          type='password'
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder='Masukkan NIM'
          className='w-full p-2 border rounded-lg mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400'
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className='w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition'>
          {loading ? 'Memeriksa...' : 'Verifikasi'}
        </button>
      </div>
    </div>
  );
}
