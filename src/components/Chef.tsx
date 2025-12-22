import React from 'react';

const Chef: React.FC = () => {
  return (
    <section id="chef" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-[#1A1A1A] rounded-[40px] p-8 md:p-20 relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="order-2 lg:order-1">
              <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">Meet Our Visionary</h2>
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 font-display">Chef Akash Saini</h3>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                  With over 5 years of mastery in leading kitchens across Italy and India, Chef Akash Saini brings a unique fusion of traditional Neapolitan techniques and locally sourced hill spices.
                </p>
                <p>
                  Specializing in artisanal sourdough and thin-crust fusion pizzas, his philosophy is simple: "Innovation should never compromise authenticity."
                </p>
              </div>
              
              <div className="mt-12 flex flex-wrap gap-10">
                <div>
                  <p className="text-white text-3xl font-bold mb-1">5+</p>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Years Experience</p>
                </div>
                <div>
                  <p className="text-white text-3xl font-bold mb-1">100k+</p>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Pizzas Served</p>
                </div>
                <div>
                  <p className="text-white text-3xl font-bold mb-1">Top 1</p>
                  <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">In Kaladhungi</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/20 rounded-[30px] rotate-6 scale-95"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=1200&auto=format&fit=crop" 
                  alt="Chef Akash Saini" 
                  className="relative w-full aspect-[4/5] object-cover rounded-[30px] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1577219491135-ce391730fbaf?q=80&w=1200&auto=format&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chef;

