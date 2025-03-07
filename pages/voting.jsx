import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import styles from '../styles/voting.module.css'; // Import CSS Module
import toast from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';

export default function VotingPage() {
  const [votes, setVotes] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [flipped, setFlipped] = useState({});

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
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('urut', { ascending: true });

      if (error) console.error('Supabase Error:', error);
      else setVotes(data);
    }

    fetchVotes();

    // 🔴 Realtime Listener untuk cek status valid
    const subscription = supabase
      .channel('realtime-voting')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'data_pemilih' },
        (payload) => {
          if (payload.new.nim === storedUser.nim && !payload.new.valid) {
            toast.error('Status Anda tidak valid, mohon login ulang!');
            localStorage.removeItem('user');
            setTimeout(() => {
              router.push('/verify');
            }, 1500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
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

  const flipCard = (id) => {
    setFlipped((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div
      className=' bg-green-200 min-h-screen gradi flex flex-col justify-center'
      // style={{
      //   backgroundImage: "url('bgVoting.jpg')",
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
    >
      <Analytics />
      <div className='mb-6 '>
        <h1 className='text-2xl md:text-3xl font-bold mt-4 md:mt-0 text-green-700 text-center'>
          Calon Ketua Angkatan <br /> Teknik Informatika ITERA 24{' '}
        </h1>
      </div>
      <div className='flex flex-wrap justify-center gap-12 md:gap-6 last:mb-4'>
        {votes.length > 0 ? (
          votes.map((vote) => (
            <div className='h-fit'>
              <div
                onClick={() => flipCard(vote.id)}
                key={vote.id}
                className={`w-72 md:w-96 h-96 hover:scale-110 transform-gpu transition-transform duration-300 shadow-md gap-6 md:gap-0 ${styles['card-container']}`}>
                <div
                  className={`${styles['card-inner']} ${
                    flipped[vote.id] ? styles.flipped : ''
                  }`}>
                  {/* Front Side */}
                  <div
                    className={`${styles['card-front']} bg-white border-4 border-green-700 shadow-lg flex flex-col items-center text-center`}>
                    <img
                      src={vote.image}
                      alt={vote.option}
                      className='w-full h-full object-cover'
                    />
                    <div className='w-full bg-green-700 text-green-300 p-2 absolute bottom-0 flex flex-row justify-center items-center'>
                      <div className='absolute pt-4 text-2xl h-full px-4 font-bold left-0 flex justify-center bg-yellow-500 text-'>
                        <p>{vote.urut}</p>
                      </div>
                      <div>
                        <h3 className='text-lg font-bold'>{vote.option}</h3>
                        <p className='text-sm'>NIM: {vote.nim}</p>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div
                    className={`${styles['card-back']} bg-gradient-to-b from-green-600 to-green-800 text-white flex items-center justify-center text-center p-4`}>
                    <div>
                      <h3 className=' text-md md:text-lg font-bold'>
                        {vote.option}
                      </h3>
                      <p className='text-xs md:text-sm'>
                        Visi: <br /> {vote.visi} <br />
                      </p>
                      <div className='text-xs md:text-sm'>
                        <p className='font-bold'>Misi:</p>
                        {vote.misi
                          .match(/\d+\..+?(?=\d+\.|$)/gs)
                          ?.map((misi, index) => (
                            <p key={index}>{misi.trim()}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => addVote(vote.id, vote.count)}
                className='mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mb-4'>
                Vote
              </button>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>Tidak ada data voting</p>
        )}
      </div>
    </div>
  );
}
