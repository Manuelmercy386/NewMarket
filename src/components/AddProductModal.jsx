import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose, store, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stockQuantity: '15',
    category: store?.category || 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    badge: 'Fresh Batch 🌟',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `prod-${Date.now()}`,
      storeId: store?.id || 'store-1',
      storeName: store?.storeName || 'My Student Store',
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stockQuantity: parseInt(formData.stockQuantity, 10),
      category: formData.category,
      imageUrl: formData.imageUrl,
      rating: 5.0,
      reviews: 1,
      badge: formData.badge,
    };

    onProductAdded(newProduct);
    onClose();
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

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#395082] flex items-center justify-center font-bold">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Add Product to Storefront</h3>
            <p className="text-xs text-slate-500">Store: <strong className="text-[#395082]">{store?.storeName}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-700 font-bold block mb-1">Product Title *</label>
            <input 
              type="text" 
              placeholder="e.g. Glazed Chocolate Donuts (4-Pack)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Price (₦) *</label>
              <input 
                type="number" 
                placeholder="4000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Original Price (₦)</label>
              <input 
                type="number" 
                placeholder="5000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Stock Qty *</label>
              <input 
                type="number" 
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Description</label>
            <textarea 
              rows={3}
              placeholder="Freshly baked in Moremi Hall..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-700 font-bold block mb-1">Image URL</label>
            <input 
              type="text" 
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
              className="px-6 py-2.5 rounded-xl bg-[#395082] hover:bg-[#2c3f68] text-white font-extrabold shadow-sm flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Product</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
