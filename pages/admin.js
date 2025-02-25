import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('data_pemilih')
      .select('nim, nama, valid, vote, wait')
      .eq('wait', true);

    if (error) {
      toast.error('Gagal mengambil data!');
    } else {
      setUsers(data);
    }
  }

  async function verifyUser(nim) {
    const { error } = await supabase
      .from('data_pemilih')
      .update({ valid: true, wait: false })
      .eq('nim', nim);

    if (error) {
      toast.error('Gagal memverifikasi!');
    } else {
      toast.success('Pengguna terverifikasi!');
      setUsers(users.filter((user) => user.nim !== nim));
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-50 p-6'>
      <h1 className='text-3xl font-bold text-green-600 mb-6'>
        Dashboard Admin
      </h1>

      <div className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>
          Menunggu Verifikasi
        </h2>

        {users.length === 0 ? (
          <p className='text-gray-600'>
            Tidak ada pemilih yang menunggu validasi.
          </p>
        ) : (
          <div className='space-y-4'>
            {users.map((user) => (
              <div
                key={user.nim}
                className='flex justify-between items-center p-4 border-b border-gray-200'>
                <div>
                  <p className='text-lg font-medium text-gray-800'>
                    {user.nama}
                  </p>
                  <p className='text-sm text-gray-500'>NIM: {user.nim}</p>
                  <p className='text-sm text-gray-500'>
                    Status Vote: {user.vote ? '✅ Sudah' : '❌ Belum'}
                  </p>
                </div>
                <button
                  onClick={() => verifyUser(user.nim)}
                  className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition'>
                  Terverifikasi
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
