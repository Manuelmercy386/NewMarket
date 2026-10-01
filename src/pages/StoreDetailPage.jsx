import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, Star, Clock, MapPin, CheckCircle, MessageSquare, PlusCircle } from 'lucide-react';

export const StoreDetailPage = ({ store, products, onBack, onAddProductClick, isOwner }) => {
  if (!store) return null;

  const storeProducts = products.filter((p) => p.storeId === store.id);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello ${store.vendorName}, I found your storefront "${store.storeName}" on NewMarket!`);
    window.open(`https://wa.me/${store.whatsApp.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-bold flex items-center gap-2 transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Stores</span>
      </button>

      {/* Store Header Banner */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        
        <div className="relative h-48 sm:h-64 w-full bg-slate-100">
          <img 
            src={store.banner} 
            alt={store.storeName}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-extrabold text-[#1b9e4b] shadow-sm flex items-center gap-1.5 border border-slate-100">
            <CheckCircle className="w-4 h-4 text-[#1b9e4b]" />
            <span>{store.badge || 'Campus Verified Store'}</span>
          </div>
        </div>

        {/* Store Information */}
        <div className="p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            
            <div className="flex items-end gap-4">
              <img 
                src={store.avatar} 
                alt={store.storeName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white" 
              />
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{store.storeName}</h1>
                <p className="text-xs sm:text-sm text-[#395082] font-bold">{store.vendorName}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#1b9e4b] border border-emerald-200 text-xs font-bold flex items-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>

              {isOwner && (
                <button
                  onClick={onAddProductClick}
                  className="px-5 py-2.5 rounded-xl bg-[#395082] hover:bg-[#2c3f68] text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              )}
            </div>

          </div>

          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed mb-6">
            {store.description}
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 text-amber-600 font-extrabold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{store.rating} ({store.reviewsCount} verified reviews)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4 text-[#1b9e4b]" />
              <span>Avg Delivery: <strong className="text-slate-900">{store.deliveryTime}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-4 h-4 text-[#395082]" />
              <span>Pickup Spot: <strong className="text-slate-900">{store.location}</strong></span>
            </div>
          </div>

        </div>

      </div>

      {/* Store Catalog */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Store Catalog ({storeProducts.length} Items)
        </h2>

        {storeProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">No products currently listed in this storefront.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
