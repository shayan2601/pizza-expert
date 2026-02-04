'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User, UtensilsCrossed, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/#menu' },
    { name: 'Orders', href: '/orders' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 py-4",
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-premium py-3" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <UtensilsCrossed className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black font-heading tracking-tighter text-secondary group-hover:text-primary transition-colors">
            PIZZA<span className="text-primary italic">EXPERT</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="font-semibold text-secondary/80 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
          
          {user?.role === 'admin' && (
            <Link 
              href="/admin"
              className="font-semibold text-primary hover:text-primary-dark transition-colors relative group"
            >
              Admin Panel
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-dark transition-all group-hover:w-full" />
            </Link>
          )}
          
          <div className="flex items-center gap-6 ml-4 border-l pl-8 border-gray-200">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart size={22} className="text-secondary" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Welcome</span>
                  <span className="text-xs font-bold text-secondary">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-100 font-bold text-xs"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary !px-6 !py-2.5 !text-sm !rounded-xl">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-xl font-bold text-secondary hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Link href="/cart" className="btn btn-primary flex-1" onClick={() => setIsOpen(false)}>
                  <ShoppingCart size={20} className="mr-2" /> Cart ({cartCount})
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
