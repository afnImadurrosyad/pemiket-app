import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Corousel from '../components/Carousel';
import HeroSection from '../components/HeroSection';
import Feedback from '../components/Feedback';
import Rundown from './../components/Rundown';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Home() {
  return (
    <div className='overflow-x-hidden'>
      <SpeedInsights />
      <Analytics />
      <Navbar />
      <HeroSection />
      <Corousel />
      <Rundown />
      <Feedback />
    </div>
  );
}
