import React from 'react';
import { ADDRESS, PHONE_PRIMARY, PHONE_SECONDARY, WHATSAPP_NUMBER, OPENING_HOURS } from '../constants';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';

// Instagram Logo Component
const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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
                href="https://www.instagram.com/pahadi_pizza_uk04"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-500/20"
              >
                <InstagramIcon className="w-5 h-5" />
                Follow on Instagram
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

