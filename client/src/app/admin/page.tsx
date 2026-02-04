'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Package, ShoppingBag, Settings, CheckCircle, Clock, Truck } from 'lucide-react';

const API_URL = 'http://localhost:3001';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tab, setTab] = useState('orders'); // orders, products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'orders') {
        const response = await axios.get(`${API_URL}/orders`);
        setOrders(response.data);
      } else {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <Navbar />
      <div className="container section-padding">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Admin Panel</h1>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <button
            onClick={() => setTab('orders')}
            className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          >
            <ShoppingBag size={20} /> Manage Orders
          </button>
          <button
            onClick={() => setTab('products')}
            className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Settings size={20} /> Manage Products
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : tab === 'orders' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order: any) => (
              <div key={order._id} style={{ background: 'white', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)', display: 'grid', gridTemplateColumns: '1fr 200px', gap: '40px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>ID: {order._id}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontWeight: 600 }}>{order.customerName} - {order.customerPhone}</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{order.customerAddress}</p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {order.items.map((item: any, i: number) => (
                      <span key={i} style={{ fontSize: '0.85rem', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                        {item.quantity}x {item.name} ({item.size})
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', opacity: 0.6 }}>Total Amount</span>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>PKR {order.totalAmount}</span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--secondary)', color: 'white' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Product Name</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Variants</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px' }}>{product.name}</td>
                    <td style={{ padding: '16px' }}>{product.category}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {product.variants.map((v: any, i: number) => (
                          <span key={i} style={{ fontSize: '0.8rem' }}>
                            {v.size}: <strong>{v.price}</strong>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
