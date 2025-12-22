import React from 'react';
import { REVIEWS } from '../data';
import { Star, Quote } from 'lucide-react';

const Reviews: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 font-display">What Our Patrons Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all">
              <Quote className="absolute top-8 right-8 w-10 h-10 text-red-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-8 italic">"{review.comment}"</p>
              <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.author}</h4>
                  <p className="text-gray-400 text-xs">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;

