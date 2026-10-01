import React from 'react';
import { Store, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-slate-600 text-xs">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#395082] text-white flex items-center justify-center font-bold shadow-sm">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">New<span className="text-[#395082]">Market</span></span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            The unified campus marketplace empowering student entrepreneurs with multi-vendor storefronts, escrow-protected payments, and doorstep hostel delivery.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#1b9e4b] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Escrow Protected Student Commerce</span>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-extrabold mb-3">Campus Categories</h4>
          <ul className="space-y-2 text-slate-500 text-[11px]">
            <li><a href="#" className="hover:text-[#395082] transition">Hostel Eats & Bakes</a></li>
            <li><a href="#" className="hover:text-[#395082] transition">Tech & Dorm Accessories</a></li>
            <li><a href="#" className="hover:text-[#395082] transition">Campus Apparel & Drip</a></li>
            <li><a href="#" className="hover:text-[#395082] transition">Skincare & Dorm Glam</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-extrabold mb-3">For Student Vendors</h4>
          <ul className="space-y-2 text-slate-500 text-[11px]">
            <li><a href="#" className="hover:text-[#395082] transition">Create Student Storefront</a></li>
            <li><a href="#" className="hover:text-[#395082] transition">Vendor Order Management</a></li>
            <li><a href="#" className="hover:text-[#395082] transition">Real-time Stock Inventory</a></li>
            <li><a href="#" className="hover:text-[#395082] transition">Sub-Order State Machine</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-extrabold mb-3">Campus Safety & Trust</h4>
          <div className="space-y-2 text-[11px]">
            <p className="text-slate-500">All student transactions are verified through student ID and hostel confirmation.</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="font-extrabold text-slate-900">Buyer Protection:</p>
              <p className="text-slate-600">Funds are held in escrow and released to student sellers only after doorstep delivery confirmation.</p>
            </div>
          </div>
        </div>

      </div>

      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4 text-[11px]">
        <p>© 2026 NewMarket Campus Multi-Vendor Marketplace. All rights reserved.</p>
        <div className="flex items-center gap-3 text-slate-500">
          <span>Student Commerce Network</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#395082] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow Guaranteed</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
