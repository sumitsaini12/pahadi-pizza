'use client';

import React, { useState } from 'react';
import { BRAND_NAME, TAGLINE, ADDRESS, PHONE_PRIMARY, INSTAGRAM_URL, EMAIL_ADDRESS } from '../constants';
import { Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const handleJoinWhatsAppGroup = () => {
    const phoneNumber = '8755613893';
    const messageText = 'Please add my number to Pahadi Pizza group for upcoming offers and updates';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;
    
    try {
      window.open(whatsappUrl, '_blank');
      setMessage({ type: 'success', text: 'Opening WhatsApp... Please send the message to join our group!' });
      setTimeout(() => {
        setMessage({ type: null, text: '' });
      }, 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to open WhatsApp. Please try again.' });
      setTimeout(() => {
        setMessage({ type: null, text: '' });
      }, 5000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-16">
          <div className="lg:col-span-1">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">{BRAND_NAME}</span>
            </a>
            <p className="text-gray-400 leading-relaxed mb-8">
              Bringing the authentic wood-fired pizza experience to the foothills of Himalayas. Crafted with love, served with pride.
            </p>
            <div className="flex gap-4">
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-not-allowed opacity-50" 
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors cursor-not-allowed opacity-50" 
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a 
                  href="#menu" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector('#menu');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-red-500 transition-colors"
                >
                  Our Menu
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector('#about');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-red-500 transition-colors"
                >
                  Brand Story
                </a>
              </li>
              <li>
                <a 
                  href="#chef" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector('#chef');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-red-500 transition-colors"
                >
                  Master Chef
                </a>
              </li>
              <li>
                <a 
                  href="#location" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector('#location');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-red-500 transition-colors"
                >
                  Location
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-3">
                <span className="text-gray-500">Add:</span>
                {ADDRESS}
              </li>
              <li className="flex gap-3">
                <span className="text-gray-500">Call:</span>
                {PHONE_PRIMARY}
              </li>
              <li className="flex gap-3">
                <span className="text-gray-500">Mail:</span>
                <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-red-500 transition-colors">
                  {EMAIL_ADDRESS}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-red-600">Newsletter</h4>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              If you want to stay up to date with better orders and updates, please join our WhatsApp member group.
            </p>
            <button 
              onClick={handleJoinWhatsAppGroup}
              className="w-full bg-[#25D366] text-white px-5 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/30 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Join WhatsApp group</span>
            </button>
            {message.type && (
              <p className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. All Rights Reserved. Crafted for quality. Created by Sumit Kumar</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

