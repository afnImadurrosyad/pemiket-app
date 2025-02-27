import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';

export default function VotingPage() {
  const [votes, setVotes] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
      router.push('/verify');
      return;
    }

    setUser(storedUser);

    if (storedUser.vote) {
      router.push('/report');
      return;
    }

    async function fetchVotes() {
      const { data, error } = await supabase.from('votes').select('*');

      if (error) console.error('Supabase Error:', error);
      else setVotes(data);
    }

    fetchVotes();
  }, [router]);

  async function addVote(id, currentCount) {
    if (!user) return;

    const { error: voteError } = await supabase
      .from('votes')
      .update({ count: currentCount + 1 })
      .eq('id', id);

    const { error: userError } = await supabase
      .from('data_pemilih')
      .update({ vote: true })
      .eq('nim', user.nim);

    if (voteError || userError) {
      console.error('Error voting:', voteError || userError);
    } else {
      localStorage.removeItem('user');
      router.push('/report');
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-green-400 p-4'>
      <h1 className='text-3xl font-bold mb-4 text-white'>CAKETANG</h1>
      <ul className='min-h-96 flex justify-center bg-white shadow-md rounded-lg p-4'>
        {votes.length > 0 ? (
          votes.map((vote) => (
            <li
              key={vote.id}
              className='flex flex-col min-w-max justify-between items-center p-2 border-2'>
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
