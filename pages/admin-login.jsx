import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';
import Head from 'next/head';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const adminDataStr = localStorage.getItem('admin_data');
    if (adminDataStr) {
      const adminData = JSON.parse(adminDataStr);
      const currentTime = new Date().getTime();
      console.log(currentTime);
      console.log(adminData.loginTime);
      const sessionDuration =
        (currentTime - adminData.loginTime) / (1000 * 60 * 60);

      //time session harus sama dengan di admin
      if (sessionDuration >= 0.3) {
        toast.error('Mohon Login Kembali!');
        toast.error('ADMIN SESSION EXPIRED');
      }
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();

    const adminDataStr = localStorage.getItem('admin_data');
    if (adminDataStr) {
      const adminData = JSON.parse(adminDataStr);
      const currentTime = new Date().getTime();
      console.log(currentTime);
      console.log(adminData.loginTime);
      const sessionDuration =
        (currentTime - adminData.loginTime) / (1000 * 60 * 60);

      //time session harus sama dengan di admin
      if (sessionDuration >= 0.03) {
        await supabase
          .from('admin_users')
          .update({ login: false })
          .eq('username', adminData.username);
      }
    }

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('password, login')
      .eq('username', username)
      .single();

    if (error || !admin) {
      toast.error('Username tidak ditemukan!');
      return;
    }

    // if (error || admin.login) {
    //   toast.error('anda sudah login di perangkat lain!');
    //   return;
    // }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      toast.error('Password salah!');
      return;
    }

    await supabase
      .from('admin_users')
      .update({ login: true })
      .eq('username', username);

    toast.success('Login berhasil!');

    if (adminDataStr) {
      localStorage.removeItem('admin_data'); // Hapus data admin
    }
    // Simpan username di localStorage
    // Upon successful login
    const loginData = {
      username: username,
      loggedIn: true,
      loginTime: new Date().getTime(), // Current time in milliseconds
    };
    localStorage.setItem('admin_data', JSON.stringify(loginData));

    setTimeout(() => {
      router.push('/admin'); // Redirect ke halaman admin
    }, 1000);
  }

  return (
    <>
      <Head>
        <title>Admin Login | Bumi Ketupat</title>
      </Head>
      <div className='min-h-screen flex justify-center items-center bg-gray-100 '>
        <form
          onSubmit={handleLogin}
          className='bg-white p-6 rounded-lg max-w-96 mx-4 shadow-lg border-t-4 border-green-400'>
          <h2 className='text-xl text-green-600 font-bold mb-4'>Admin Login</h2>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border p-2 w-full mb-3 text-gray-600'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border p-2 w-full mb-3 text-gray-600'
          />
          <button
            type='submit'
            className='bg-green-600 text-white w-full p-2 rounded'>
            Login
          </button>
        </form>
      </div>
    </>
  );
}
