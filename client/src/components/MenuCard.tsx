'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingBag, Flame, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

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

const MenuCard = React.memo(({ product }: { product: Product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="premium-card group h-full flex flex-col justify-between"
    >
      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
            {product.category}
          </span>
          {product.category.toLowerCase().includes('pizza') && (
            <Flame size={16} className="text-primary" />
          )}
        </div>

        <h3 className="text-xl font-black font-heading text-secondary group-hover:text-primary transition-colors duration-300 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 min-h-[40px] mb-6">
          {product.description || "Expertly prepared using our secret recipe and freshest local ingredients for maximum flavor."}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-2 mb-6">
          {product.variants.map((v) => (
            <button
              key={v.size}
              onClick={() => setSelectedVariant(v)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 border",
                selectedVariant.size === v.size
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300"
              )}
            >
              {v.size}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
            <span className="text-2xl font-black text-secondary tracking-tighter">
              <span className="text-sm font-medium text-gray-400 mr-1">PKR</span>
              {selectedVariant.price}
            </span>
          </div>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, selectedVariant.size, selectedVariant.price)}
            className="btn-primary w-12 h-12 !rounded-full !p-0 flex items-center justify-center group/btn shadow-glow"
          >
            <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-300" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default MenuCard;
