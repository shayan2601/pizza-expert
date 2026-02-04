'use client';

import React, { useState } from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Variant {
  size: string;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  variants: Variant[];
  description?: string;
}

export default function MenuCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { addToCart } = useCart();

  return (
    <div className="fade-in" style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      boxShadow: 'var(--shadow)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div>
        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
          {product.category}
        </span>
        <h3 style={{ fontSize: '1.25rem', marginTop: '4px' }}>{product.name}</h3>
        {product.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>{product.description}</p>}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {product.variants.map((v) => (
            <button
              key={v.size}
              onClick={() => setSelectedVariant(v)}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                border: selectedVariant.size === v.size ? '2px solid var(--primary)' : '2px solid var(--surface)',
                background: selectedVariant.size === v.size ? 'var(--primary)' : 'white',
                color: selectedVariant.size === v.size ? 'white' : 'var(--text)',
                fontWeight: 600
              }}
            >
              {v.size}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>PKR {selectedVariant.price}</span>
          </div>
          <button
            onClick={() => addToCart(product, selectedVariant.size, selectedVariant.price)}
            className="btn btn-primary"
            style={{ padding: '8px 16px' }}
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>

      <style jsx>{`
        div:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}
