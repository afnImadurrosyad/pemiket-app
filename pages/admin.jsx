import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const [admins, setAdmin] = useState([]);
  const [users, setUsers] = useState([]);
  const [userValid, setValid] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('admin_username');
    if (!storedUsername) {
      router.push('/admin-login'); // Redirect ke login jika tidak ada admin yang masuk
    } else {
      setAdminUsername(storedUsername);
    }
    // Cek apakah admin sudah login
    const adminLogin = localStorage.getItem('admin_logged_in');
    if (!adminLogin) {
      router.push('/admin-login'); // Redirect ke halaman login jika belum login
      return;
    }
    setIsLoggedIn(true);

    fetchUsers();
    fetchvalid();
    fetchAdmin();

    const subscription = supabase
      .channel('realtime admin')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'data_pemilih',
        },
        (payload) => {
          console.log('Realtime Update:', payload);
          fetchUsers();
          fetchvalid();
        }
      )
      .subscribe();

    const adminUsersSubscription = supabase
      .channel('realtime-admin-users')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'admin_users',
        },
        (payload) => {
          console.log('Realtime Update (admin_users):', payload);
          fetchAdmin();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(adminUsersSubscription);
      supabase.removeChannel(subscription);
    };
  }, []);

  //fecth admin
  async function fetchAdmin() {
    const { data, error } = await supabase
      .from('admin_users')
      .select('username')
      .eq('login', true);

    if (error) {
      toast.error('Gagal mengambil data!');
    } else {
      setAdmin(data);
    }
  }

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

  async function fetchvalid() {
    const { data, error } = await supabase
      .from('data_pemilih')
      .select('nim, nama, valid, vote, wait')
      .eq('valid', true);

    if (error) {
      toast.error('Gagal mengambil data!');
    } else {
      setValid(data);
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

  async function deleteUser(nim) {
    const { error } = await supabase
      .from('data_pemilih')
      .update({ valid: false, wait: false, vote: false })
      .eq('nim', nim);

    if (error) {
      toast.error('Gagal menghapus pengguna!');
    } else {
      toast.success('Pengguna Berhasil Dihapus!');
      setValid(users.filter((user) => user.nim !== nim));
    }
  }

  async function handleAdminLogout(username) {
    const { error } = await supabase
      .from('admin_users')
      .update({ login: false })
      .eq('username', username);

    if (error) {
      toast.error('Gagal logout Admin!');
    } else {
      toast.success('Admin Berhasil Logout!');
      localStorage.removeItem('admin_logged_in'); // Hapus status login
      localStorage.removeItem('admin_username'); // Hapus username
      setTimeout(() => {
        router.push('/admin-login'); // Redirect ke halaman login
      }, 2000);
    }
  }

  if (!isLoggedIn) return null; // Mencegah render sebelum cek login selesai

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-50'>
      {/* list admin online */}
      <div className='bg-gray-700 min-w-20 mt-1 rounded-md max-h-6'>
        {admins.length === 0 ? (
          <p className='text-white'>Tidak ada admin lain yang sedang online.</p>
        ) : (
          <div className='flex flex-wrap'>
            <div className='text-white text-xs px-2 py-1 rounded-lg mb-1'>
              Admin Online :
            </div>
            {admins.map((admin) => (
              <div
                key={admin.username}
                className='text-white text-xs px-2 py-1 rounded-lg mb-1'>
                {admin.username}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='flex justify-around items-center w-screen mb-4'>
        <h1 className='text-3xl font-bold text-green-600 '>Dashboard Admin</h1>
        <button
          onClick={() => handleAdminLogout(adminUsername)}
          className='bg-red-500 mr-4 mb-2 text-white text-xs px-2 py-2 rounded-lg hover:bg-red-700 transition'>
          Logout
        </button>
      </div>

      {/* laman bagian verifikasi */}
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
                  className='bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition'>
                  Verifikasi!
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* laman bagian terverifikasi */}
      <div className='w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg m-4'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>
          Sudah terverifikasi
        </h2>

        {userValid.length === 0 ? (
          <p className='text-gray-600'>
            Tidak ada pemilih yang sudah terverifikasi
          </p>
        ) : (
          <div className='space-y-4'>
            {userValid.map((user) => (
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
                <div className='flex flex-col space-x-4 '>
                  <div className='text-green-700 px-1 py-1 text-xs rounded-lg mb-1 hover:bg-green-300 transition'>
                    Terverifikasi!
                  </div>
                  <button
                    onClick={() => deleteUser(user.nim)}
                    className='bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-700 transition'>
                    Hapus!
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
