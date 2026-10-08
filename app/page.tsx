'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="landing-page">
      <div className="hero-section">
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
          }}
        >
          <motion.h1 
            className="hero-title"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            <span className="gradient-text">Stay organized.</span><br />
            Never miss a moment.
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            A beautiful, intelligent reminder app designed to keep your life on track.
          </motion.p>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                transition: { duration: 0.5, ease: "easeOut" } 
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'inline-block', position: 'relative' }}
          >
            <motion.div
              animate={{ 
                boxShadow: ['0px 0px 0px 0px rgba(139, 92, 246, 0.4)', '0px 0px 0px 15px rgba(139, 92, 246, 0)'],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeOut",
                delay: 1 
              }}
              style={{ borderRadius: '0.75rem' }}
            >
              <Link href="/signup" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '0.75rem', marginTop: '1rem' }}>
                Get Started - It's Free
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
