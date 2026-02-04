'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="container section-padding">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600, marginBottom: '32px' }}>
          <ArrowLeft size={20} /> Back to Menu
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Shopping Cart</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}`} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Size: {item.size}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '4px 12px', borderRadius: '30px' }}>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}><Minus size={16} /></button>
                    <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}><Plus size={16} /></button>
                  </div>
                  <span style={{ fontWeight: 800, minWidth: '80px', textAlign: 'right' }}>PKR {item.price * item.quantity}</span>
                  <button onClick={() => removeFromCart(item.productId, item.size)} style={{ color: 'var(--primary)', padding: '8px' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--secondary)', color: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', opacity: 0.8 }}>
              <span>Subtotal</span>
              <span>PKR {cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', opacity: 0.8 }}>
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', fontWeight: 800, fontSize: '1.25rem' }}>
              <span>Total</span>
              <span>PKR {cartTotal}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
