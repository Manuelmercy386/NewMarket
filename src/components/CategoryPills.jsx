import React from 'react';
import { Sparkles, Utensils, Laptop, Shirt, Heart, BookOpen } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Sparkles },
  { id: 'pastry', name: 'Hostel Eats & Bakes', icon: Utensils },
  { id: 'tech', name: 'Tech & Dorm Gadgets', icon: Laptop },
  { id: 'fashion', name: 'Campus Drip & Wear', icon: Shirt },
  { id: 'beauty', name: 'Skincare & Dorm Glam', icon: Heart },
  { id: 'books', name: 'Notes & Stationery', icon: BookOpen },
];

export const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>Explore Campus Categories</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {CATEGORIES.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500">Filter verified student products by category</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#395082] text-white border-[#395082] shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#395082]'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
