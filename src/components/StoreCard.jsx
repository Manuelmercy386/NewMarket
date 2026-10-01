import React from 'react';
import { Star, Clock, MapPin, CheckCircle, ArrowUpRight } from 'lucide-react';

export const StoreCard = ({ store, onSelectStore }) => {
  return (
    <div 
      onClick={() => onSelectStore(store)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Store Banner */}
        <div className="relative h-28 w-full overflow-hidden bg-slate-100">
          <img 
            src={store.banner} 
            alt={store.storeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          
          {/* Badge Tag */}
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-[#1b9e4b] shadow-sm flex items-center gap-1 border border-slate-100">
            <CheckCircle className="w-3 h-3 text-[#1b9e4b]" />
            <span>{store.badge || 'Verified Vendor'}</span>
          </div>

          {/* Direct Visit Arrow */}
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/90 text-slate-700 flex items-center justify-center group-hover:bg-[#395082] group-hover:text-white transition">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Store Info & Avatar */}
        <div className="p-4 relative">
          <div className="flex items-start gap-3 -mt-8 mb-2">
            <img 
              src={store.avatar} 
              alt={store.storeName}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md bg-white"
            />
            <div className="mt-5 min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#395082] transition truncate leading-snug">
                {store.storeName}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">{store.vendorName}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {store.tagline || store.description}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 pb-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/50">
        <div className="flex items-center gap-1 text-amber-600 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{store.rating} ({store.reviewsCount})</span>
        </div>

        <div className="flex items-center gap-1 text-slate-600 font-medium">
          <Clock className="w-3.5 h-3.5 text-[#1b9e4b]" />
          <span>{store.deliveryTime}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 truncate max-w-[100px]">
          <MapPin className="w-3 h-3 text-[#395082]" />
          <span className="truncate">{store.location}</span>
        </div>
      </div>
    </div>
  );
};
