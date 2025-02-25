import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('data_pemilih')
      .select('nim, nama, valid, vote, wait')
      .eq('wait', true); // Ambil hanya yang menunggu validasi

    if (error) {
      console.error('Gagal mengambil data:', error);
    } else {
      setUsers(data);
    }
  }

  async function verifyUser(nim) {
    const { error } = await supabase
      .from('data_pemilih')
      .update({ valid: true, wait: false }) // Set valid = true & wait = false
      .eq('nim', nim);

    if (error) {
      console.error('Gagal memverifikasi:', error);
    } else {
      setUsers(users.filter((user) => user.nim !== nim)); // Hapus dari daftar setelah verifikasi
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-100 p-6'>
      <h1 className='text-2xl font-bold text-gray-700 mb-6'>Dashboard Admin</h1>

      <div className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-4'>
          Daftar Pemilih Menunggu Verifikasi
        </h2>

        {users.length === 0 ? (
          <p className='text-gray-600'>
            Tidak ada pemilih yang menunggu validasi.
          </p>
        ) : (
          <table className='w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='border border-gray-300 p-2'>NIM</th>
                <th className='border border-gray-300 p-2'>Nama</th>
                <th className='border border-gray-300 p-2'>Status Vote</th>
                <th className='border border-gray-300 p-2'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.nim} className='text-center'>
                  <td className='border border-gray-300 p-2'>{user.nim}</td>
                  <td className='border border-gray-300 p-2'>{user.nama}</td>
                  <td className='border border-gray-300 p-2'>
                    {user.vote ? 'Sudah' : 'Belum'}
                  </td>
                  <td className='border border-gray-300 p-2'>
                    <button
                      onClick={() => verifyUser(user.nim)}
                      className='bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600'>
                      Terverifikasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
