'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';

const API_URL = 'http://localhost:3001';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
      };

      const response = await axios.post(`${API_URL}/orders`, orderData);
      clearCart();
      router.push(`/orders?id=${response.data._id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="container section-padding">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '60px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Delivery Information</h3>
            
            <div className="input-group">
              <label>Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                required
                type="tel"
                placeholder="0300 1234567"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Delivery Address</label>
              <textarea
                required
                rows={4}
                placeholder="Street name, House number, Area..."
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', padding: '16px' }} disabled={loading}>
              {loading ? 'Processing...' : `Place Order (PKR ${cartTotal})`}
            </button>
          </form>

          <div>
            <div style={{ background: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Your Order</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{item.quantity}x {item.name} ({item.size})</span>
                    <span style={{ fontWeight: 600 }}>PKR {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Total Amount</span>
                <span>PKR {cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        label {
          font-weight: 600;
          font-size: 0.9rem;
        }
        input, textarea {
          padding: 12px;
          border-radius: var(--radius-sm);
          border: 1px solid #ddd;
          font-family: inherit;
        }
        input:focus, textarea:focus {
          border-color: var(--primary);
          outline: none;
        }
      `}</style>
    </main>
  );
}
