import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import bcrypt from 'bcryptjs';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    const { data: admin, error } = await supabase
      .from('admin_users')
      .update({ login: true })
      .select('password')
      .eq('username', username)
      .single();

    if (error || !admin) {
      toast.error('Username tidak ditemukan!');
      return;
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      toast.error('Password salah!');
      return;
    }

    toast.success('Login berhasil!');
    localStorage.setItem('admin_logged_in', 'true'); // Simpan status login
    setTimeout(() => {
      router.push('/admin'); // Redirect ke halaman admin
    }, 1000);
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
      <form
        onSubmit={handleLogin}
        className='bg-white p-6 rounded-lg shadow-lg'>
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
  );
}
