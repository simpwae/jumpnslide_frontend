import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, StarIcon, PartyPopperIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Package } from '../types';
interface PackageCardProps {
  pkg: Package;
}
export function PackageCard({ pkg }: PackageCardProps) {
  // Generate a consistent placeholder gradient based on the slug
  const getGradient = (slug: string) => {
    if (slug.includes('ultimate')) return 'from-purple-600 to-pink-600';
    if (slug.includes('starter')) return 'from-blue-500 to-cyan-400';
    if (slug.includes('splash')) return 'from-cyan-400 to-blue-600';
    if (slug.includes('snack')) return 'from-yellow-400 to-orange-500';
    if (slug.includes('game')) return 'from-green-500 to-emerald-600';
    if (slug.includes('bash')) return 'from-pink-500 to-rose-500';
    return 'from-brand-blue to-brand-purple';
  };
  const getTagColor = (type: string) => {
    switch (type) {
      case 'popular':
        return 'bg-brand-pink text-white';
      case 'value':
        return 'bg-brand-blue text-white';
      case 'deal':
        return 'bg-red-500 text-white animate-pulse';
      case 'premium':
        return 'bg-amber-500 text-white';
      case 'famous':
        return 'bg-purple-500 text-white';
      case 'recommended':
        return 'bg-emerald-500 text-white';
      case 'best-seller':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-brand-purple text-white';
    }
  };
  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      initial={{
        opacity: 0,
        y: 20
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        margin: '-50px'
      }}>
      
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getGradient(pkg.slug)} opacity-90 group-hover:scale-105 transition-transform duration-500`} />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <PartyPopperIcon className="w-16 h-16 text-white/50" />
        </div>

        {/* Tag */}
        {pkg.tag &&
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${getTagColor(pkg.tag.type)}`}>
          
            {pkg.tag.label}
          </div>
        }
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-2xl text-brand-navy mb-2">
          {pkg.name}
        </h3>

        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-extrabold text-brand-navy">
            AED {pkg.price.toLocaleString()}
          </span>
        </div>

        {/* Social Proof */}
        <div className="flex items-center text-sm text-gray-500 mb-6 bg-brand-light px-3 py-2 rounded-lg">
          <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
          <span className="font-medium text-brand-navy mr-1">{pkg.rating}</span>
          <span>({pkg.reviewCount})</span>
          <span className="mx-2">·</span>
          <span>🎉 Booked {pkg.bookingCount} times</span>
        </div>

        {/* Highlights */}
        <ul className="space-y-3 mb-8 flex-1">
          {pkg.highlights.map((highlight, idx) =>
          <li key={idx} className="flex items-start">
              <CheckIcon className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{highlight}</span>
            </li>
          )}
        </ul>

        {/* Action */}
        <Link
          to={`/packages/${pkg.slug}`}
          className="w-full py-3 px-4 bg-brand-light text-brand-navy font-semibold rounded-xl text-center group-hover:bg-gradient-brand group-hover:text-white transition-all duration-300">
          
          View Details
        </Link>
      </div>
    </motion.div>);

}