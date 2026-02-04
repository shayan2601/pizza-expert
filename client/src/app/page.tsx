'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuCard from '@/components/MenuCard';
import { ChevronRight, Search, Pizza, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3001';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 8;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      setCategories(['All', ...response.data]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (pageNum: number, category: string, append: boolean = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const url = category === 'All' 
        ? `${API_URL}/products?page=${pageNum}&limit=${LIMIT}`
        : `${API_URL}/products?category=${category}&page=${pageNum}&limit=${LIMIT}`;
      
      const response = await axios.get(url);
      const newProducts = response.data;

      if (append) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setHasMore(newProducts.length === LIMIT);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1, activeCategory, false);
  }, [activeCategory]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, activeCategory, true);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      <section id="menu" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 block">Our Specialties</span>
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-secondary mb-4">
                Explore Our <span className="italic text-primary">Masterpieces</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Hand-picked ingredients crafted with years of expertise. Find your favorites among our signature pizzas and juicy burgers.
              </p>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="sticky top-24 z-40 mb-12 py-4 bg-white/10 backdrop-blur-sm -mx-6 px-6 overflow-hidden">
            <motion.div 
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-8 py-3 rounded-2xl whitespace-nowrap font-bold text-sm transition-all duration-300
                    ${activeCategory === cat 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Preparing Menu...</p>
            </div>
          ) : (
            <>
              <motion.div 
                className="grid grid-cols-1 sm:sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                <AnimatePresence>
                  {products.map((product: any) => (
                    <MenuCard key={product._id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {hasMore && (
                <div className="flex justify-center mt-20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="btn btn-outline border-primary/20 text-secondary font-black px-12 py-4 rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Discover More <ChevronRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-secondary text-white pt-32 pb-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="bg-primary p-2 rounded-lg">
                  <Pizza className="text-white" size={24} />
                </div>
                <span className="text-3xl font-black font-heading tracking-tighter text-white">
                  PIZZA<span className="text-primary italic">EXPERT</span>
                </span>
              </Link>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Since 2010, we've been dedicated to the art of creating the perfect pizza. 
                Our secret lies in our fresh dough, homemade sauces, and locally sourced premium ingredients.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-black text-xl mb-8 uppercase tracking-widest text-primary">Quick Links</h4>
              <ul className="flex flex-col gap-4 text-gray-400 font-bold">
                <li><Link href="/" className="hover:text-white transition-colors">Order Now</Link></li>
                <li><Link href="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-black text-xl mb-8 uppercase tracking-widest text-primary">Hours</h4>
              <ul className="flex flex-col gap-4 text-gray-400 font-bold">
                <li>Mon - Thu: 11:00 AM - 12:00 AM</li>
                <li>Fri - Sun: 11:00 AM - 02:00 AM</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">
              &copy; 2026 Pizza Expert. Redefining Taste.
            </p>
            <div className="flex gap-8 text-gray-500 font-bold text-sm uppercase tracking-widest">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
