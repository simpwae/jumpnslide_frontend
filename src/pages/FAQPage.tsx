import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FAQS } from '../data';

export function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setFaqs(data);
        else setFaqs(FAQS);
      });
  }, []);

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-24">
      <div className="bg-brand-navy py-16 px-4 text-center">
        <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Everything you need to know about booking with Jump N Slide 4 Kids.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-brand-navy pr-4">{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-brand-pink shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}