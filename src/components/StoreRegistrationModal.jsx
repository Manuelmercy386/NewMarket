import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Store, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const StoreRegistrationModal = ({ isOpen, onClose, onStoreCreated }) => {
  const { user, register } = useAuth();

  const [formData, setFormData] = useState({
    storeName: '',
    category: 'pastry',
    tagline: '',
    description: '',
    location: 'Moremi Hall, Block B (OAU)',
    whatsApp: '+2348012345678',
    banner: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStore = {
      id: `store-${Date.now()}`,
      vendorId: user?.id || `user-vendor-${Date.now()}`,
      vendorName: user?.fullName || 'Student Vendor',
      storeName: formData.storeName,
      slug: formData.storeName.toLowerCase().replace(/\s+/g, '-'),
      tagline: formData.tagline || 'Quality student goods delivered right to your hostel!',
      description: formData.description || 'Verified student-run campus business.',
      category: formData.category,
      avatar: formData.avatar,
      banner: formData.banner,
      rating: 5.0,
      reviewsCount: 1,
      deliveryTime: '15-25 mins',
      location: formData.location,
      verified: true,
      badge: 'Campus Verified Vendor 🛡️',
      whatsApp: formData.whatsApp,
    };

    register({
      fullName: user?.fullName || 'Student Vendor',
      email: user?.email || 'vendor@student.edu.ng',
      role: 'VENDOR',
      storeName: formData.storeName,
    });

    onStoreCreated(newStore);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 text-[#1b9e4b] mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-[#1b9e4b]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Student Storefront Created!</h3>
              <p className="text-xs text-slate-500 mt-1">You can now list products and receive campus sub-orders.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#395082] flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Launch Your Student Storefront</h3>
                <p className="text-xs text-slate-500">Sell snacks, gadgets, fashion & services to campus mates</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Store Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fajuyi Kitchen & Pastries"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
                  >
                    <option value="pastry">Hostel Eats & Bakes</option>
                    <option value="tech">Tech & Gadgets</option>
                    <option value="fashion">Campus Drip & Wear</option>
                    <option value="beauty">Skincare & Dorm Glam</option>
                    <option value="books">Notes & Books</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Hostel Pickup Location</label>
                  <input 
                    type="text" 
                    placeholder="Moremi Hall, Block B"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Catchy Store Tagline</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fresh warm meatpies, donuts & iced zobo!"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">WhatsApp Phone Number</label>
                <input 
                  type="text" 
                  value={formData.whatsApp}
                  onChange={(e) => setFormData({ ...formData, whatsApp: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff7e00] hover:bg-[#e57100] text-white font-extrabold shadow-sm flex items-center gap-1.5 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Storefront</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
