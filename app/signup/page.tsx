'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { email, password });
      setAuth(res.data.access_token, email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      style={{ maxWidth: 400, margin: '4rem auto' }} 
      className="glass-panel p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-lg mb-6" style={{ textAlign: 'center' }}>Create an Account</h1>
      {error && <div className="error-box mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="flex-col gap-4">
        <div>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        <div className="mt-4">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
            required
            minLength={6}
          />
        </div>
        <motion.div
          animate={{ boxShadow: ['0px 0px 0px 0px rgba(139, 92, 246, 0.3)', '0px 0px 0px 10px rgba(139, 92, 246, 0)'] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeOut", delay: 2 }}
          style={{ borderRadius: '0.5rem', marginTop: '2rem' }}
        >
          <motion.button 
            type="submit" 
            className="btn-primary w-full" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </motion.div>
      </form>
      <div className="mt-6 text-center text-sm text-muted">
        Already have an account? <a href="/login" style={{ color: 'var(--input-focus)' }}>Sign in</a>
      </div>
    </motion.div>
  );
}
