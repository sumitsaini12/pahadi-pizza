import React from 'react';
import { FEATURES } from '../constants';
import { Leaf, Flame, Timer, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-red-100 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform"></div>
            <img 
              src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1974&auto=format&fit=crop" 
              alt="Artisanal Pizza Making" 
              className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-10 -right-6 md:-right-10 bg-white p-8 rounded-2xl shadow-xl max-w-xs border border-gray-100 hidden md:block">
              <p className="text-red-600 font-bold text-4xl mb-1">5+</p>
              <p className="text-gray-600 font-medium leading-tight">Years of Culinary Excellence in Italian Fusion.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">Our Story</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-display">
                Rooted in the Hills, <br />Crafted with Passion.
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Pahadi Pizza was born from a simple desire: to bring world-class Italian pizza techniques to the serene landscapes of Uttarakhand. We believe that great pizza starts with great water and fresh mountain air, combined with artisanal recipes passed down through generations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {FEATURES.map((feature) => {
                const IconComponent = {
                  Leaf,
                  Flame,
                  Timer,
                  ShieldCheck,
                }[feature.iconName];
                return (
                  <div key={feature.title} className="flex flex-col gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      {IconComponent && <IconComponent className={`w-6 h-6 ${feature.iconColor}`} />}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

