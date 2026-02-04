'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { 
  BarChart3, 
  Package, 
  Settings, 
  LogOut, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Loader2,
  TrendingUp,
  ShoppingBag,
  Users,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

const API_URL = 'http://localhost:3001';
const KITCHEN_CAPACITY = 5;

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tab, setTab] = useState('orders'); // orders, products
  const [loading, setLoading] = useState(true);
  const [newOrderNotify, setNewOrderNotify] = useState<any>(null);
  const [notifiedOrderIds, setNotifiedOrderIds] = useState<Set<string>>(new Set());
  const { token, logout } = useAuth();

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
      console.error('Audio playback failed:', e);
    }
  };

  const fetchData = async (isPoll = false) => {
    if (!isPoll) setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${API_URL}/orders`, config),
        axios.get(`${API_URL}/products`)
      ]);
      
      const fetchedOrders = ordersRes.data;
      const now = new Date().getTime();
      let triggeredNotification = false;

      const newOrders = fetchedOrders.filter((order: any) => 
        !notifiedOrderIds.has(order._id) && 
        (now - new Date(order.createdAt).getTime()) < 60000
      );

      if (newOrders.length > 0) {
        setNewOrderNotify(newOrders[0]);
        setNotifiedOrderIds(prev => new Set([...prev, ...newOrders.map((o: any) => o._id)]));
        triggeredNotification = true;
      }

      const stalePendingOrder = fetchedOrders.find((order: any) => 
        order.status === 'pending' && 
        (now - new Date(order.createdAt).getTime()) > 30 * 60 * 1000
      );

      if (stalePendingOrder && !triggeredNotification) {
        setNewOrderNotify({ ...stalePendingOrder, isStale: true });
        triggeredNotification = true;
      }

      if (triggeredNotification) {
        playNotificationSound();
        setTimeout(() => setNewOrderNotify(null), 8000);
      }

      setOrders(fetchedOrders);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      if (!isPoll) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
      const interval = setInterval(() => fetchData(true), 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const activeOrdersCount = orders.filter(o => o.status === 'preparing').length;
  const queuePercentage = Math.min((activeOrdersCount / KITCHEN_CAPACITY) * 100, 100);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-600 border-green-200';
      case 'preparing': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <main className="min-h-screen bg-[#F8F9FA]">
        <Navbar />
        
        <div className="flex pt-20">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-100 h-[calc(100vh-80px)] sticky top-20 p-8">
            <div className="mb-12">
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-6 px-4">Management</span>
               <nav className="space-y-2">
                  {[
                    { id: 'orders', icon: ShoppingBag, label: 'Live Orders' },
                    { id: 'products', icon: Utensils, label: 'Menu Items' },
                    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
                    { id: 'customers', icon: Users, label: 'Customers' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-300",
                        tab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-50 hover:text-secondary"
                      )}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
               </nav>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-100">
               <button 
                 onClick={logout}
                 className="flex items-center gap-4 px-4 py-4 text-gray-400 font-bold hover:text-red-500 transition-colors w-full"
               >
                  <LogOut size={20} />
                  Sign Out
               </button>
            </div>
          </aside>

          {/* Content */}
          <section className="flex-1 p-8 lg:p-12 relative">
            <AnimatePresence>
              {newOrderNotify && (
                <motion.div 
                  initial={{ opacity: 0, y: -50, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -50, x: '-50%' }}
                  className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-white px-8 py-5 rounded-premium shadow-2xl border border-primary/20 flex items-center gap-6 min-w-[400px]"
                >
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-bounce">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">
                      {newOrderNotify.isStale ? "⚠️ STALE ORDER ALERT!" : "New Order Received!"}
                    </span>
                    <h4 className="font-black text-lg tracking-tighter">Order #{newOrderNotify._id.slice(-6).toUpperCase()}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase">
                      {newOrderNotify.isStale ? "Pending for > 30 mins" : `${newOrderNotify.customerName} • PKR ${newOrderNotify.totalAmount}`}
                    </p>
                  </div>
                  <button onClick={() => setNewOrderNotify(null)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* In-Progress Queue Section */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-3xl font-black font-heading tracking-tightest text-secondary">Kitchen <span className="italic text-primary">Queue</span></h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Orders currently being prepared</p>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{orders.filter(o => o.status === 'preparing').length} In Progress</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.filter(o => o.status === 'preparing').map((order) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={order._id}
                    className="premium-card !p-6 border-l-4 border-l-orange-500 group hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase">Preparing</span>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-black text-secondary leading-tight mb-1">{order.customerName}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{order.items.map((it: any) => `${it.quantity}x ${it.name}`).join(', ')}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-sm text-primary">PKR {order.totalAmount}</span>
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                        className="btn bg-green-500 hover:bg-green-600 !text-white !py-2 !px-4 !text-[10px] !rounded-xl shadow-glow opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Ready to Dispatch
                      </button>
                    </div>
                  </motion.div>
                ))}
                {orders.filter(o => o.status === 'preparing').length === 0 && (
                  <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-premium border-2 border-dashed border-gray-100">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">No orders in progress</p>
                  </div>
                )}
              </div>
            </div>

            {/* Header Stats & Queue Indicator */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
               {[
                 { label: 'Total Sales', value: `PKR ${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
                 { label: 'Active Orders', value: orders.filter(o => o.status !== 'delivered').length, icon: Clock, color: 'text-primary' },
                 { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-500' },
               ].map((stat, i) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={i} 
                   className="bg-white p-8 rounded-premium shadow-sm border border-gray-100 flex items-center justify-between"
                 >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">{stat.label}</span>
                      <span className="text-2xl font-black font-heading tracking-tighter text-secondary">{stat.value}</span>
                    </div>
                    <div className={cn("p-4 rounded-xl bg-gray-50", stat.color)}>
                      <stat.icon size={20} />
                    </div>
                 </motion.div>
               ))}

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-white p-8 rounded-premium shadow-sm border border-gray-100"
               >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Kitchen Queue</span>
                      <span className="text-2xl font-black font-heading tracking-tighter text-secondary">{activeOrdersCount}/{KITCHEN_CAPACITY}</span>
                    </div>
                    <div className={cn(
                      "p-3 rounded-xl",
                      activeOrdersCount >= KITCHEN_CAPACITY ? "bg-red-50 text-red-500" : "bg-primary/5 text-primary"
                    )}>
                      <Utensils size={18} />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${queuePercentage}%` }}
                      className={cn(
                        "h-full transition-all duration-1000",
                        activeOrdersCount >= KITCHEN_CAPACITY ? "bg-red-500" : "bg-primary"
                      )}
                    />
                  </div>
                  {activeOrdersCount >= KITCHEN_CAPACITY && (
                    <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest mt-2 block animate-pulse">Capacity Reached</span>
                  )}
               </motion.div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-40">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-premium shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <h2 className="text-2xl font-black font-heading tracking-tighter capitalize">{tab} Management</h2>
                  <div className="relative w-full md:w-80">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      placeholder="Search..." 
                      className="w-full bg-gray-50 border-none p-4 pl-12 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {tab === 'orders' ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                          <th className="px-8 py-6">Order Info</th>
                          <th className="px-8 py-6">Customer</th>
                          <th className="px-8 py-6">Amount</th>
                          <th className="px-8 py-6">Status</th>
                          <th className="px-8 py-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                               <span className="block font-bold text-secondary text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                               <span className="text-[10px] text-gray-400 font-bold uppercase">{order.items.length} Items</span>
                            </td>
                            <td className="px-8 py-6">
                               <span className="block font-bold text-secondary text-sm">{order.customerName}</span>
                               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.customerPhone}</span>
                            </td>
                            <td className="px-8 py-6">
                               <span className="text-lg font-black text-secondary tracking-tighter">PKR {order.totalAmount}</span>
                            </td>
                            <td className="px-8 py-6">
                               <span className={cn(
                                 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                 getStatusColor(order.status)
                               )}>
                                 {order.status}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex gap-2">
                                 {order.status !== 'preparing' && order.status !== 'delivered' && (
                                   <button 
                                     onClick={() => updateOrderStatus(order._id, 'preparing')}
                                     className="p-2 bg-orange-50 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                                   >
                                     <Clock size={18} />
                                   </button>
                                 )}
                                 {order.status !== 'delivered' && (
                                   <button 
                                     onClick={() => updateOrderStatus(order._id, 'delivered')}
                                     className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                                   >
                                     <CheckCircle2 size={18} />
                                   </button>
                                 )}
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-20 text-center opacity-20">
                       <Package size={80} className="mx-auto mb-6" />
                       <p className="font-black uppercase tracking-[0.3em] text-xs">Menu management coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
