import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { PHONE_PRIMARY, WHATSAPP_NUMBER } from '../constants';

const StickyCTA: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md flex gap-4 md:hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <a 
        href={`tel:${PHONE_PRIMARY.replace(/\s/g, '')}`} 
        className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-red-600/40 border border-red-500"
      >
        <Phone className="w-5 h-5" />
        Call
      </a>
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}`} 
        className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-2xl shadow-green-600/40 border border-[#128C7E]"
      >
        <MessageCircle className="w-5 h-5" />
        Order
      </a>
    </div>
  );
};

export default StickyCTA;

