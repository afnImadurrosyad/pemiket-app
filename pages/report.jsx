import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ReportPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman utama setelah beberapa detik
    // const timeout = setTimeout(() => {
    //   router.push('/');
    // }, 5000);
    // return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-green-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg text-center mx-4'>
        <h1 className='text-xl font-bold mb-4 text-green-700'>Terima Kasih!</h1>
        <p className='text-gray-600'>Anda telah berhasil memberikan suara.</p>
        <p className='text-gray-500 text-sm mt-2'>
          Anda akan diarahkan ke halaman utama dalam beberapa detik...
        </p>
      </div>
    </div>
  );
}
