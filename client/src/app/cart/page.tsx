'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 flex flex-col items-center justify-center py-40">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8"
          >
            <ShoppingBag size={48} className="text-gray-200" />
          </motion.div>
          <h2 className="text-4xl font-black font-heading tracking-tighter text-secondary mb-4 text-center">Your cart is feeling lonely</h2>
          <p className="text-gray-400 text-lg mb-12 text-center max-w-md">Looks like you haven't added any of our delicious masterpieces to your cart yet.</p>
          <Link href="/#menu" className="btn btn-primary px-8 py-4 text-lg">
            Explore Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-32">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all">
          <ArrowLeft size={16} /> Back to Menu
        </Link>
        
        <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tightest text-secondary mb-16">
          Your <span className="italic text-primary">Basket</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <AnimatePresence mode='popLayout'>
              {cart.map((item) => (
                <motion.div 
                  layout
                  key={`${item.productId}-${item.size}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-premium border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col sm:flex-row justify-between items-center gap-6"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-black font-heading text-secondary">{item.name}</h3>
                    <span className="text-xs font-black uppercase tracking-widest text-primary/60">Size: {item.size}</span>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-secondary hover:text-primary transition-colors"
                      >
                        <Minus size={18} />
                      </motion.button>
                      <span className="font-black text-lg min-w-[30px] text-center">{item.quantity}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-secondary hover:text-primary transition-colors"
                      >
                        <Plus size={18} />
                      </motion.button>
                    </div>

                    <div className="text-right min-w-[120px]">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Subtotal</span>
                      <span className="text-xl font-black text-secondary tracking-tighter">PKR {item.price * item.quantity}</span>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.1, color: '#FF3131' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.productId, item.size)} 
                      className="text-gray-300 transition-colors"
                    >
                      <Trash2 size={22} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-secondary rounded-premium p-10 text-white shadow-premium overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-3xl font-black font-heading mb-10 tracking-tighter">Summary</h3>
              
              <div className="space-y-6 mb-10 font-bold text-gray-400">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-white">PKR {cartTotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-xs">Delivery Fees</span>
                  <span className="text-green-400 uppercase tracking-widest text-[11px]">Free</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mb-12">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest text-primary font-black">Total Amount</span>
                  <span className="text-4xl font-black tracking-tightest">PKR {cartTotal}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn btn-primary w-full py-5 text-lg font-black shadow-glow group">
                Proceed to Checkout
                <ArrowLeft className="ml-2 rotate-180 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
