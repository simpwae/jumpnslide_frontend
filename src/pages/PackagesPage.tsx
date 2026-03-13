import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PackageCard } from '../components/PackageCard';
import { PACKAGES } from '../data';
import { MessageCircleIcon } from 'lucide-react';
export function PackagesPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = [
  'All',
  'Budget-Friendly',
  'With Inflatables',
  'Premium',
  'Theme Parties'];

  const filteredPackages = PACKAGES.filter((pkg) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Budget-Friendly') return pkg.price < 1500;
    if (activeFilter === 'With Inflatables')
    return (
      pkg.inclusions.selectableInflatables > 0 ||
      pkg.inclusions.fixedItems.some((i) =>
      i.toLowerCase().includes('playground')
      ));

    if (activeFilter === 'Premium') return pkg.price >= 1700;
    if (activeFilter === 'Theme Parties')
    return pkg.slug.includes('bash') || pkg.slug.includes('ultimate');
    return true;
  });
  return (
    <main className="pt-20 min-h-screen bg-brand-light">
      {/* Hero */}
      <div className="bg-brand-navy py-16 px-4 text-center">
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
          Our Packages
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Find the perfect setup for your celebration. All packages include
          delivery, setup, and professional staff.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) =>
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? 'bg-brand-pink text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
            
              {filter}
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPackages.map((pkg) =>
          <PackageCard key={pkg.slug} pkg={pkg} />
          )}

          {/* Build Your Own Card */}
          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full mb-4">
              Coming Soon
            </span>
            <h3 className="font-heading font-bold text-2xl text-brand-navy mb-2">
              Build Your Own
            </h3>
            <p className="text-gray-500 mb-6">
              Want to create a custom package? Message us directly and we'll
              build it for you.
            </p>
            <a
              href="https://wa.me/971506477052"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-blue transition-colors">
              
              Contact on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </main>);

}