'use client';

import React, { useState } from 'react';
import { MENU_ITEMS } from '../data';
import { MenuItem } from '../types';
import { MessageCircle, Phone, Star, ArrowRight } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_PRIMARY } from '../constants';

const Menu: React.FC = () => {
  const categories: MenuItem['category'][] = ['Veg Pizzas', 'Starters', 'Pasta', 'Burger', 'Momo', 'Chowmein', 'Shake'];
  const [activeCategory, setActiveCategory] = useState<MenuItem['category']>('Veg Pizzas');

  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  // Group by sub-category
  const groupedItems = filteredItems.reduce((acc, item) => {
    const sub = item.subCategory || 'Other';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <section id="menu" className="py-24 md:py-32 bg-[#FBFBFD]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-red-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">Artisanal Selection</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-[#1D1D1F] font-display tracking-tight mb-6">
            Our Curated Menu
          </h3>
          <p className="text-[#86868B] text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Handcrafted delicacies made with fresh ingredients and authentic hill-inspired flavors.
          </p>
        </div>

        {/* Apple-style Category Switcher */}
        <div className="flex justify-start md:justify-center mb-16 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0">
          <div className="inline-flex p-1 bg-[#F5F5F7] rounded-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 md:px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-white text-[#1D1D1F] shadow-sm' 
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Display Grouped Sections */}
        <div className="space-y-24">
          {Object.entries(groupedItems).map(([subCat, items]) => (
            <div key={subCat} className="reveal">
              {subCat !== 'Other' && (
                <div className="flex items-center gap-3 mb-10">
                  <div className="h-6 w-1.5 bg-red-600 rounded-full"></div>
                  <h4 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] tracking-tight">
                    {subCat}
                  </h4>
                </div>
              )}
              {activeCategory === 'Veg Pizzas' ? (
                <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <div className="flex gap-8 md:gap-10 min-w-max">
                    {items.map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-[320px] md:w-[360px]">
                        <MenuCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-[#F5F5F7] rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="w-8 h-8 text-[#86868B]" />
            </div>
            <p className="text-[#86868B] font-light">Updating our fresh stock. Stay tuned.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const currentVariant = item.variants[selectedVariantIdx] || item.variants[0];

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col group border border-[#F2F2F2] hover:-translate-y-1">
      {/* Premium Image Container */}
      <div className="h-60 md:h-64 overflow-hidden relative bg-[#F5F5F7]">
        {item.isPopular && (
          <div className="absolute top-5 left-5 z-10 bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5 border border-white/10 shadow-lg">
            <Star className="w-2.5 h-2.5 fill-orange-400 text-orange-400" />
            Bestseller
          </div>
        )}
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800';
          }}
        />
      </div>

      <div className="p-7 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h4 className="text-lg md:text-xl font-bold text-[#1D1D1F] leading-snug">{item.name}</h4>
          <div className="text-lg md:text-xl font-bold text-red-600 whitespace-nowrap tabular-nums">
            ₹{currentVariant.price}/-
          </div>
        </div>
        <p className="text-[#86868B] text-xs md:text-sm leading-relaxed mb-6 font-light flex-grow">
          {item.description}
        </p>

        {/* Size/Quantity Picker - More compact */}
        {item.variants.length > 1 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2 px-0.5">
              <p className="text-[9px] uppercase tracking-[0.12em] font-bold text-[#A1A1A6]">
                {['Momo', 'Chowmein'].includes(item.category) ? 'Quantity' : 'Select Size'}
              </p>
              <span className="text-[9px] font-bold text-red-600 bg-red-50/50 px-2 py-0.5 rounded-full border border-red-100/50">
                {currentVariant.label}
              </span>
            </div>
            <div className="flex bg-[#F5F5F7] p-1 rounded-xl">
              {item.variants.map((v, idx) => (
                <button
                  key={v.label}
                  onClick={() => setSelectedVariantIdx(idx)}
                  className={`flex-1 py-1.5 text-[10px] md:text-[11px] font-bold rounded-lg transition-all duration-300 ${
                    selectedVariantIdx === idx 
                      ? 'bg-white text-[#1D1D1F] shadow-sm' 
                      : 'text-[#86868B] hover:text-[#1D1D1F]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs - Refined Padding & Typography */}
        <div className="flex flex-col gap-2.5">
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi Pahadi Pizza, I want to order: ${item.name} ${item.variants.length > 1 ? `(${currentVariant.label})` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all duration-300 shadow-lg shadow-green-100/30 active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            Order on WhatsApp
          </a>
          <a 
            href={`tel:${PHONE_PRIMARY.replace(/\s/g, '')}`}
            className="w-full bg-white border border-[#E8E8ED] text-[#1D1D1F] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F5F5F7] transition-all duration-300 active:scale-[0.98]"
          >
            <Phone className="w-3.5 h-3.5" />
            Quick Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default Menu;

