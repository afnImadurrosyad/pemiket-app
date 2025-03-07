import { motion } from 'framer-motion';
import { useState } from 'react';
import emailjs from 'emailjs-com';

export default function Form() {
  const [submitted, setSubmitted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        e.target,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log('Success:', result.text);
          setSubmitted(true);
        },
        (error) => {
          console.error('Error:', error.text);
        }
      );
  };

  return (
    <section id='feedback' className=' py-10 px-6 md:px-12 pb-20 bg-gray-100'>
      <motion.div
        className='max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}>
        {/* Judul */}
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-green-700 text-center mb-6'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}>
          Feedback
        </motion.h2>

        {/* Form */}
        {!submitted ? (
          <form
            className='flex flex-col space-y-4 text-gray-700'
            onSubmit={sendEmail} // Panggil sendEmail saat submit
          >
            {/* Input Name */}
            <motion.input
              type='text'
              name='name'
              placeholder='Your Name'
              required
              className='border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400'
              whileFocus={{ scale: 1.05 }}
            />

            {/* Input Email */}
            <motion.input
              type='email'
              name='email'
              placeholder='Your Email'
              required
              className='border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400'
              whileFocus={{ scale: 1.05 }}
            />

            {/* Textarea Message */}
            <motion.textarea
              name='message'
              placeholder='Your Message'
              rows='4'
              required
              className='border p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400'
              whileFocus={{ scale: 1.05 }}
            />

            {/* Button Submit */}
            <motion.button
              type='submit'
              className='bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-lg transition'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Send Message
            </motion.button>
          </form>
        ) : (
          <motion.p
            className='text-green-700 font-semibold text-center mt-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            ✅ Thank you for your feedback!
          </motion.p>
        )}
        {/* Contact Info */}
        <motion.div
          className='mt-8 text-center text-gray-700'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <h3 className='text-xl font-semibold'>Contact Information</h3>
          <p className='mt-2 flex items-center justify-center gap-2'>📞 +62</p>
          <p className='mt-1 flex items-center justify-center gap-2'>
            📩 informaticsitera24@gmail.com
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
