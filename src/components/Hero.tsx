import React from 'react';
import { BRAND_NAME, TAGLINE, WHATSAPP_NUMBER } from '../constants';
import { Phone, MessageCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[90vh] md:h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" 
          alt="Premium Pizza Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-block px-4 py-1.5 bg-red-600/20 backdrop-blur-md border border-red-500/30 rounded-full mb-6">
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase">Now Open in Kaladhungi</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight font-display">
            {BRAND_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-lg leading-relaxed font-light">
            {TAGLINE}. Hand-stretched, wood-fired, and served with love in the heart of Uttarakhand.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="tel:+918755613893" 
              className="flex items-center justify-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-red-700 hover:scale-[1.02] transition-all shadow-2xl shadow-red-600/40"
            >
              <Phone className="w-6 h-6" />
              Call Now
            </a>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 hover:scale-[1.02] transition-all"
            >
              <MessageCircle className="w-6 h-6 text-green-400" />
              WhatsApp Order
            </a>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fcfcfc] to-transparent"></div>
    </section>
  );
};

export default Hero;

