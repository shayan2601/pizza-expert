'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Clock, CheckCircle, Package, Truck, Search } from 'lucide-react';

const API_URL = 'http://localhost:3001';

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');

  const fetchOrder = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={40} color="var(--primary)" />;
      case 'preparing': return <Package size={40} color="var(--accent)" />;
      case 'delivered': return <CheckCircle size={40} color="#27ae60" />;
      default: return <Truck size={40} color="var(--text-muted)" />;
    }
  };

  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>Track Your Order</h1>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '60px' }}>
          <input
            style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #ddd' }}
            placeholder="Enter Order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={() => fetchOrder(searchId)} className="btn btn-primary">
            <Search size={20} /> Track
          </button>
        </div>

        {loading && <p style={{ textAlign: 'center' }}>Loading order details...</p>}

        {order && (
          <div className="fade-in" style={{ background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                {getStatusIcon(order.status)}
              </div>
              <h2 style={{ fontSize: '1.75rem', textTransform: 'capitalize' }}>Status: {order.status}</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Order ID: {order._id}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', borderTop: '1px solid #eee', paddingTop: '32px' }}>
              <div>
                <h3 style={{ marginBottom: '16px' }}>Order Items</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.items.map((item: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                      <span>{item.quantity}x {item.name} ({item.size})</span>
                      <span style={{ fontWeight: 600 }}>PKR {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #ddd', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>Total Paid</span>
                  <span>PKR {order.totalAmount}</span>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '16px' }}>Delivery Details</h3>
                <p style={{ fontWeight: 600 }}>{order.customerName}</p>
                <p style={{ color: 'var(--text-muted)' }}>{order.customerPhone}</p>
                <p style={{ marginTop: '12px' }}>{order.customerAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <OrderContent />
      </Suspense>
    </main>
  );
}
