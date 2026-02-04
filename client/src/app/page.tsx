'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MenuCard from '@/components/MenuCard';

const API_URL = 'http://localhost:3001';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
        const cats: string[] = ['All', ...Array.from(new Set(response.data.map((p: any) => p.category))) as string[]];
        setCategories(cats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p: any) => p.category === activeCategory);

  return (
    <main>
      <Navbar />
      <Hero />
      
      <section id="menu" className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Our Delicious Menu</h2>
            <p style={{ color: 'var(--text-muted)' }}>From wood-fired pizzas to juicy burgers, we have it all.</p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
            overflowX: 'auto',
            paddingBottom: '16px',
            scrollbarWidth: 'none'
          }}>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '30px',
                  whiteSpace: 'nowrap',
                  background: activeCategory === cat ? 'var(--primary)' : 'var(--surface)',
                  color: activeCategory === cat ? 'white' : 'var(--text)',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading menu...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px'
            }}>
              {filteredProducts.map((product: any) => (
                <MenuCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer style={{ background: 'var(--secondary)', color: 'white', padding: '60px 0', marginTop: '80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '16px' }}>PIZZA EXPERT</h2>
          <p style={{ opacity: 0.7, maxWidth: '500px', margin: '0 auto 32px' }}>
            Bringing you the finest ingredients and authentic recipes since 2010. Your satisfaction is our specialty.
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px', fontSize: '0.8rem', opacity: 0.5 }}>
            &copy; 2026 Pizza Expert. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
