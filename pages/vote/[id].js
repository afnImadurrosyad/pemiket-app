import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabase';

export default function VoteDetail() {
  const router = useRouter();
  const { id } = router.query; // Ambil ID dari URL
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchVote() {
        const { data, error } = await supabase
          .from('votes')
          .select('*')
          .eq('id', id)
          .single(); // Ambil satu data berdasarkan id

        if (error) console.error('Error fetching vote:', error);
        else setVote(data);
        setLoading(false);
      }
      fetchVote();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!vote) return <p>Data tidak ditemukan</p>;

  return (
    <div>
      <h1>Detail Voting</h1>
      <p>Opsi: {vote.option}</p>
      <p>Jumlah Suara: {vote.count}</p>
      <button onClick={() => router.push('/')}>Kembali</button>
    </div>
  );
}
