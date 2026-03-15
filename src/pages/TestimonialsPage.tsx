import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TESTIMONIALS } from '../data';

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
        else setTestimonials(TESTIMONIALS);
      });
  }, []);

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-24">
      <div className="bg-brand-navy py-16 px-4 text-center">
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
          What Our Customers Say
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Real reviews from real families who trusted us with their special moments.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4 flex-1">"{review.text}"</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-brand-navy">{review.name}</p>
                <p className="text-sm text-brand-pink">
                  {review.package_name || review.packageName} · {review.date}
                </p>
              </div>
              {(review.admin_reply || review.adminReply) && (
                <div className="mt-4 bg-brand-light p-4 rounded-xl text-sm">
                  <p className="font-bold text-brand-navy mb-1">Jump N Slide 4 Kids replied:</p>
                  <p className="text-gray-600">{review.admin_reply || review.adminReply}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}