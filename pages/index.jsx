import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Corousel from '../components/Carousel';
import HeroSection from '../components/HeroSection';
import Feedback from '../components/Feedback';
import Rundown from './../components/Rundown';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className='relative overflow-x-hidden min-h-screen bg-gray-100'>
      {/* Background dengan opacity */}
      <div
        className='absolute inset-0 bg-repeat bg-center'
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: '55%', // Mengecilkan ukuran background
          opacity: 0.4, // Atur opacity ke 50%
        }}
      />

      {/* Konten utama */}
      <div className='relative z-10'>
        <Navbar />
        <SpeedInsights />
        <Analytics />
        <HeroSection />
        <Corousel />
        <Rundown />
        <Feedback />
        <Footer />
      </div>
    </div>
  );
}
