import React from 'react';

const Gallery: React.FC = () => {
  const images = [
    { 
      src: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200', 
      span: 'col-span-1 md:col-span-2 row-span-2' 
    },
    { 
      src: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800', 
      span: 'col-span-1' 
    },
    { 
      src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800', 
      span: 'col-span-1' 
    },
    { 
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200', 
      span: 'col-span-1 md:col-span-2' 
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-red-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">Vibe & Taste</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] font-display">The Gallery</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          {images.map((img, i) => (
            <div 
              key={i} 
              className={`overflow-hidden rounded-[32px] ${img.span} group relative bg-[#F5F5F7] shadow-sm`}
            >
              <img 
                src={img.src} 
                alt="Gallery item" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

