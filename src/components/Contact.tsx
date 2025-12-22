import React from 'react';
import { ADDRESS, PHONE_PRIMARY, PHONE_SECONDARY, WHATSAPP_NUMBER, OPENING_HOURS } from '../constants';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';

// X (Twitter) Logo Component
const XIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

const Contact: React.FC = () => {
  return (
    <section id="location" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">Find Us</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 font-display">Our Location</h3>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Address</h4>
                  <p className="text-gray-500 leading-relaxed">{ADDRESS}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Call for Delivery</h4>
                  <p className="text-gray-500 leading-relaxed">
                    <a href={`tel:${PHONE_PRIMARY.replace(/\s/g, '')}`} className="hover:text-red-600 transition-colors">{PHONE_PRIMARY}</a>
                    <br />
                    <a href={`tel:${PHONE_SECONDARY.replace(/\s/g, '')}`} className="hover:text-red-600 transition-colors">{PHONE_SECONDARY}</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Opening Hours</h4>
                  <p className="text-gray-500 leading-relaxed">{OPENING_HOURS}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a 
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all shadow-xl shadow-black/20"
              >
                <XIcon className="w-5 h-5" />
                Follow on X
              </a>
              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent(ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="h-[450px] md:h-full rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
            {/* Embedded Google Maps for Pahadi Pizza, Main Chauraha, Kaladhungi */}
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent('Main Chauraha, Kaladhungi, Uttarakhand, India')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Pahadi Pizza Location - Main Chauraha, Kaladhungi"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

