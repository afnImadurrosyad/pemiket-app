import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Corousel from '../components/Carousel';
import HeroSection from '../components/HeroSection';
import Feedbackk from '../components/Feedback';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Link from 'next/link';
import style from '../styles/index.module.css';
import { Menu, X } from 'lucide-react';
import Feedback from './../components/Feedback';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('March 15, 2025 00:00:00').getTime();

    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(countdown);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  function goVote() {
    router.push('/voting');
  }

  return (
    <div>
      <Navbar />
      <HeroSection />
      <Corousel />
      <Feedbackk />
    </div>
  );
}
