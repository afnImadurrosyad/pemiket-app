import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export default function Home() {
  const [votes, setVotes] = useState([]);

  // 🔹 Ambil data votes dari Supabase
  useEffect(() => {
    async function fetchVotes() {
      const { data, error } = await supabase.from('votes').select('*');

      if (error) console.error('Supabase Error:', error);
      else setVotes(data);
    }

    fetchVotes();
  }, []);

  // 🔹 Fungsi untuk menambah suara
  async function addVote(id, currentCount) {
    const { error } = await supabase
      .from('votes')
      .update({ count: currentCount + 1 }) // Tambah 1 suara
      .eq('id', id);

    if (error) {
      console.error('Error voting:', error);
    } else {
      // Refresh data setelah vote
      setVotes((prevVotes) =>
        prevVotes.map((vote) =>
          vote.id === id ? { ...vote, count: vote.count + 1 } : vote
        )
      );
    }
  }
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-green-400 p-4'>
      <h1 className='text-3xl font-bold mb-4 text-white-200'>TEST DULU</h1>
      <ul className='w-full max-w-md bg-white shadow-md rounded-lg p-4'>
        {votes.length > 0 ? (
          votes.map((vote) => (
            <li
              key={vote.id}
              className='flex justify-between items-center p-2 border-b last:border-none'>
              <span className='text-lg text-green-500'>
                {vote.option}: {vote.count} votes
              </span>
              <button
                onClick={() => addVote(vote.id, vote.count)}
                className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                Vote
              </button>
            </li>
          ))
        ) : (
          <p className='text-center text-gray-500'>Tidak ada data voting</p>
        )}
      </ul>
    </div>
  );
}
