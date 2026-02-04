'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
          PIZZA EXPERT
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="#menu" className="nav-link">Menu</Link>
          <Link href="/orders" className="nav-link">Order Tracking</Link>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: '20px' }}>
            <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-12px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/admin">
              <User size={24} />
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none' }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <style jsx>{`
        .nav-link {
          font-weight: 500;
          color: var(--text);
        }
        .nav-link:hover {
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
