'use client';

import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '600px', animation: 'fadeIn 0.8s ease-out' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', display: 'block' }}>
            Authentic Italian Taste
          </span>
          <h1 style={{ fontSize: '4rem', marginBottom: '24px', lineHeight: 1.1 }}>
            Freshly Baked <span style={{ color: 'var(--primary)' }}>Pizza</span> Expertly Crafted
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
            Satisfy your cravings with our wide variety of pizzas, burgers, and signature deals. Fast delivery and premium quality guaranteed.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="#menu" className="btn btn-primary">
              Explore Menu
            </Link>
            <Link href="/orders" className="btn btn-outline">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
