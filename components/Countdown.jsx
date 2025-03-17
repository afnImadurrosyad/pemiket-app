import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Countdown({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onFinish]);

  return (
    <motion.div
      className='text-9xl font-mono text-green-700 '
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}>
      <motion.span
        key={timeLeft}
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='inline-block'>
        {timeLeft}
      </motion.span>
    </motion.div>
  );
}
