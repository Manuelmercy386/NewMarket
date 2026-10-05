import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export const AddProductModal = ({ isOpen, onClose, store, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stockQuantity: '15',
    category: store?.category || 'pastry',
    imageUrl: '',
    badge: 'Fresh Batch 🌟',
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
    const imageUrl = imageFile ? (await api.uploadImage(imageFile)).url : formData.imageUrl;
    const newProduct = {
      storeId: store?.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      stockQuantity: parseInt(formData.stockQuantity, 10),
      category: formData.category,
      imageUrl,
      badge: formData.badge,
    };

    await onProductAdded(newProduct);
    onClose();
    } catch (requestError) {
    setError(requestError.message);
    } finally {
    setSubmitting(false);
    }
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
            <label className="text-slate-700 font-bold block mb-1">Product image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
            />
            {imageFile && <p className="mt-1 text-[11px] text-slate-500">{imageFile.name}</p>}
            <label className="text-slate-700 font-bold block mb-1 mt-3">Or image URL</label>
            <input 
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:border-[#395082] focus:outline-none"
            />
          </div>

          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-red-700">{error}</p>}
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
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#395082] hover:bg-[#2c3f68] text-white font-extrabold shadow-sm flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Publishing…' : 'Publish Product'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
