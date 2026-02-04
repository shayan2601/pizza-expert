'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Clock, CheckCircle, Package, Truck, Search, MapPin, Phone, User, Loader2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_URL = 'http://localhost:3001';

function OrderContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Order not found or invalid Order ID');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
      setSearchId(orderId);
    }
  }, [orderId]);

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'preparing', 'delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="container mx-auto px-6 py-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tightest text-secondary mb-16 text-center">
          Order <span className="italic text-primary">Live Status</span>
        </h1>
        
        <div className="flex gap-4 mb-20">
          <input
            className="flex-1 bg-gray-50 border border-gray-100 p-6 rounded-2xl font-bold transition-all outline-none focus:border-primary focus:bg-white"
            placeholder="Enter Your Unique Order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchOrder(searchId)} 
            className="btn btn-primary px-10 shadow-glow"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={22} />}
          </motion.button>
        </div>

        {order ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            {/* Status Visualizer */}
            <div className="premium-card !p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    Live Updates
                  </span>
               </div>

               <div className="flex justify-between items-center relative mb-12">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(getStatusStep(order.status) / 2) * 100}%` }}
                    className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-1000" 
                  />
                  
                  {[
                    { state: 'pending', icon: Clock, label: 'Received' },
                    { state: 'preparing', icon: Package, label: 'Kitchen' },
                    { state: 'delivered', icon: Truck, label: 'Delivered' }
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = getStatusStep(order.status) >= idx;
                    const isProcessing = order.status === step.state;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-4">
                        <motion.div 
                          animate={isProcessing ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-gray-300 border-2 border-gray-100"
                          )}
                        >
                          <Icon size={28} />
                        </motion.div>
                        <span className={cn(
                          "uppercase tracking-widest text-[10px] font-black",
                          isActive ? "text-secondary" : "text-gray-300"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
               </div>

               <div className="text-center">
                  <h2 className="text-3xl font-black font-heading tracking-tighter mb-2">
                    {order.status === 'pending' && "Hang tight! Request received."}
                    {order.status === 'preparing' && "Chef is working their magic!"}
                    {order.status === 'delivered' && "Hope you enjoyed the taste!"}
                  </h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Order ID: {order._id}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-7">
                <div className="premium-card !p-10 h-full">
                  <h3 className="text-2xl font-black font-heading tracking-tighter mb-8">Items Ordered</h3>
                  <div className="space-y-6">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                        <div>
                          <span className="block font-black text-secondary">{item.quantity}x {item.name}</span>
                          <span className="text-[10px] uppercase font-black tracking-widest text-primary italic">{item.size}</span>
                        </div>
                        <span className="font-black text-lg tracking-tighter">PKR {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Paid</span>
                    <span className="text-3xl font-black text-primary tracking-tightest">PKR {order.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="bg-secondary rounded-premium p-10 text-white h-full relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                   <h3 className="text-2xl font-black font-heading tracking-tighter mb-10 text-primary">Delivery Information</h3>
                   
                   <div className="space-y-10">
                      <div className="flex gap-6 items-start">
                         <div className="bg-white/5 p-3 rounded-xl text-primary border border-white/5">
                            <User size={20} />
                         </div>
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Customer</span>
                            <span className="font-black tracking-tight">{order.customerName}</span>
                         </div>
                      </div>

                      <div className="flex gap-6 items-start">
                         <div className="bg-white/5 p-3 rounded-xl text-primary border border-white/5">
                            <Phone size={20} />
                         </div>
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Contact</span>
                            <span className="font-black tracking-tight">{order.customerPhone}</span>
                         </div>
                      </div>

                      <div className="flex gap-6 items-start">
                         <div className="bg-white/5 p-3 rounded-xl text-primary border border-white/5">
                            <MapPin size={20} />
                         </div>
                         <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1">Address</span>
                            <span className="font-black tracking-tight leading-relaxed">{order.customerAddress}</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : !loading && (
          <div className="text-center py-20 opacity-30">
             <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
             <p className="font-black uppercase tracking-[0.3em] text-xs">Enter ID to begin tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      }>
        <OrderContent />
      </Suspense>
    </main>
  );
}
