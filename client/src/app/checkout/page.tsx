'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { 
  Truck, 
  Smartphone, 
  User, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  CreditCard, 
  Banknote, 
  X 
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const API_URL = 'http://localhost:3001';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [showCardModal, setShowCardModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === 'card' && !showCardModal) {
      setShowCardModal(true);
      return;
    }

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
        paymentMethod,
        paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending'
      };

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    <ProtectedRoute>
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-32">
          <h1 className="text-5xl md:text-6xl font-black font-heading tracking-tightest text-secondary mb-16">
            Checkout <span className="italic text-primary">Process</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-12 xl:col-span-7"
            >
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="premium-card !p-10 space-y-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <User size={24} />
                    </div>
                    <h3 className="text-2xl font-black font-heading tracking-tighter">Personal Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Shayan Ali"
                        className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 rounded-xl font-bold transition-all outline-none"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                      <div className="relative">
                        <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          required
                          type="tel"
                          placeholder="0300 0000000"
                          className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 pl-12 rounded-xl font-bold transition-all outline-none"
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <MapPin size={24} />
                      </div>
                      <h3 className="text-2xl font-black font-heading tracking-tighter">Delivery Address</h3>
                    </div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Shipping Address</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Enter your street, area and nearest landmark..."
                      className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 rounded-xl font-bold transition-all outline-none resize-none"
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    />
                  </div>

                  <div className="pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <CreditCard size={24} />
                      </div>
                      <h3 className="text-2xl font-black font-heading tracking-tighter">Payment Method</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={cn(
                          "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                          paymentMethod === 'cash' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", paymentMethod === 'cash' ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                          <Banknote size={20} />
                        </div>
                        <div>
                          <span className="block font-black text-secondary">Cash on Delivery</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay when you receive</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={cn(
                          "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                          paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", paymentMethod === 'card' ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <span className="block font-black text-secondary">Credit / Debit Card</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure online payment</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="btn btn-primary w-full py-6 text-xl font-black shadow-glow group disabled:bg-gray-400" 
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    <>
                      {paymentMethod === 'card' ? 'Proceed to Payment' : `Confirm Order (PKR ${cartTotal})`}
                      <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <AnimatePresence>
                {showCardModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-secondary/80 backdrop-blur-sm p-6">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="bg-white w-full max-w-lg rounded-premium p-10 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                      
                      <button 
                        onClick={() => setShowCardModal(false)}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-secondary transition-colors"
                      >
                        <X size={24} />
                      </button>

                      <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                          <CreditCard size={32} />
                        </div>
                        <h3 className="text-3xl font-black font-heading tracking-tighter mb-2">Secure <span className="italic text-primary">Payment</span></h3>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Complete your PKR {cartTotal} transaction</p>
                      </div>

                      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Number</label>
                          <input
                            required
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 rounded-xl font-bold transition-all outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Expiry Date</label>
                            <input
                              required
                              type="text"
                              placeholder="MM/YY"
                              className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 rounded-xl font-bold transition-all outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">CVV</label>
                            <input
                              required
                              type="text"
                              placeholder="123"
                              className="w-full bg-gray-50 border border-transparent focus:border-primary focus:bg-white p-4 rounded-xl font-bold transition-all outline-none"
                            />
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="btn btn-primary w-full py-5 text-lg font-black mt-4 shadow-glow"
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="animate-spin" /> : 'Pay & Place Order'}
                        </motion.button>
                      </form>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-12 xl:col-span-5"
            >
              <div className="bg-secondary rounded-premium p-10 text-white shadow-premium sticky top-32">
                <h3 className="text-2xl font-black font-heading mb-10 tracking-tighter">Order Summary</h3>
                <div className="space-y-8 mb-10">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex justify-between items-start">
                      <div>
                        <span className="block font-black text-white">{item.quantity}x {item.name}</span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary italic">{item.size}</span>
                      </div>
                      <span className="font-black text-lg tracking-tighter">PKR {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Payable Amount</span>
                  <span className="text-4xl font-black tracking-tightest text-primary">PKR {cartTotal}</span>
                </div>
                
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                    <Truck size={20} />
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Priority Delivery Guaranteed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
