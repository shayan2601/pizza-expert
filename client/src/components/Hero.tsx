'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" 
      />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
              <Star size={16} className="fill-current" />
              #1 Rated Pizza in Town
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-8 font-heading tracking-tighter"
          >
            Crave the <br />
            <span className="gradient-text italic">Extraordinary</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
          >
            Hand-tossed dough, premium ingredients, and a passion for perfection. 
            Experience the art of pizza making like never before.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start"
          >
            <a href="#menu" className="btn btn-primary text-lg px-8 py-4 shadow-glow group">
              Order Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/orders" className="btn bg-white/5 text-white border border-white/10 hover:bg-white/10 text-lg px-8 py-4">
              Track Order
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="flex-1 relative"
        >
          {/* Main Hero Image Placeholder with aesthetic shape */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-[60px] rotate-6 opacity-20 blur-2xl animate-pulse" />
            <div className="relative z-10 w-full h-full bg-secondary-light rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center shadow-premium">
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UtensilsCrossed size={48} className="text-primary" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">Our Special Tikka</h3>
                <p className="text-gray-400">Fresh from our wood-fired oven</p>
              </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass-card p-6 rounded-2xl border-primary/30 z-20"
            >
              <div className="text-primary font-black text-2xl">PKR 500</div>
              <div className="text-secondary/60 text-xs font-bold uppercase tracking-widest">Starting Price</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}

// Internal icons helper for this component since I might have missed one import
function UtensilsCrossed({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m3 2 18 18"/><path d="m2 3 18 18"/><path d="m18 2 4 4"/><path d="m2 18 4 4"/><path d="M19 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8"/>
    </svg>
  );
}
