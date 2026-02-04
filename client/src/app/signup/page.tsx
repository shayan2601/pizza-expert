'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-40 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black font-heading tracking-tightest text-secondary mb-4">
              Join the <span className="italic text-primary">Experts</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Start your taste journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="premium-card !p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 pl-12 rounded-xl font-bold transition-all outline-none"
                    placeholder="Expert Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    required
                    type="email"
                    className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 pl-12 rounded-xl font-bold transition-all outline-none"
                    placeholder="expert@pizza.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    required
                    type="password"
                    className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 pl-12 rounded-xl font-bold transition-all outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-5 text-lg font-black shadow-glow group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-8 text-gray-400 font-bold">
            Already have an account? {' '}
            <Link href="/login" className="text-primary hover:underline italic">Login Here</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
