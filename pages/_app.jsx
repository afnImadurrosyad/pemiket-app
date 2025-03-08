import Head from 'next/head';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Bumi Ketupat | Pemilihan Ketua Angkatan 24</title>
        <meta
          name='description'
          content='Website Resmi Pemilihan Ketua Angkatan Algovista ITERA 24'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' type='image/png' href='/logo-title.png' />
      </Head>
      <Toaster position='top-center' />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
