import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import Link from 'next/link';

export default function VotePage() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase.from('votes').select('*');
      if (error) console.error('Error fetching votes:', error);
      else setVotes(data);
      setLoading(false);
    }
    fetchVotes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-2xl font-bold text-center mb-4 text-gre'>
        Halaman Voting
      </h1>
      <ul className='space-y-4 flex flex-col items-center'>
        {votes.length > 0 ? (
          votes.map((vote) => (
            <li key={vote.id} className='bg-white p-4 rounded-lg shadow'>
              <p className='text-lg font-semibold'>
                {vote.option}: {vote.count} votes
              </p>
              <Link href={`/vote/${vote.id}`}>
                <button className='mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                  Lihat Detail
                </button>
              </Link>
            </li>
          ))
        ) : (
          <p className='text-center text-gray-500'>Tidak ada data voting</p>
        )}
      </ul>
      <div className='text-center mt-6'>
        <Link href='/'>
          <button className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'>
            Kembali ke Beranda
          </button>
        </Link>
      </div>
    </div>
  );
}
