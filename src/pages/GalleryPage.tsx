import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  PackageIcon } from
'lucide-react';
// Mock Data Generation
const CATEGORIES = [
'All',
'Birthday Parties',
'Splash Events',
'Theme Parties',
'Corporate'];

const GRADIENTS = [
'from-blue-400 to-purple-500',
'from-pink-400 to-orange-400',
'from-emerald-400 to-cyan-500',
'from-amber-400 to-red-500',
'from-indigo-500 to-pink-500',
'from-teal-400 to-blue-500'];

const MOCK_EVENTS = [
{
  id: 'evt-1',
  title: "Aisha's 5th Birthday — Dubai",
  date: 'February 2026',
  pkg: 'Ultimate Party',
  category: 'Birthday Parties',
  theme: 'Princess Theme',
  photos: Array.from({
    length: 5
  }).map((_, i) => ({
    id: `evt-1-img-${i}`,
    gradient: GRADIENTS[i % GRADIENTS.length]
  }))
},
{
  id: 'evt-2',
  title: 'Summer Splash Down — Ras Al Khaimah',
  date: 'January 2026',
  pkg: 'Splash Zone',
  category: 'Splash Events',
  theme: 'Water Park Theme',
  photos: Array.from({
    length: 4
  }).map((_, i) => ({
    id: `evt-2-img-${i}`,
    gradient: GRADIENTS[(i + 2) % GRADIENTS.length]
  }))
},
{
  id: 'evt-3',
  title: 'Superhero Training Camp — Sharjah',
  date: 'December 2025',
  pkg: 'Birthday Bash',
  category: 'Theme Parties',
  theme: 'Superhero Theme',
  photos: Array.from({
    length: 6
  }).map((_, i) => ({
    id: `evt-3-img-${i}`,
    gradient: GRADIENTS[(i + 1) % GRADIENTS.length]
  }))
},
{
  id: 'evt-4',
  title: 'School End of Year Celebration — Ajman',
  date: 'November 2025',
  pkg: 'Game Day',
  category: 'Corporate',
  theme: 'Carnival Theme',
  photos: Array.from({
    length: 5
  }).map((_, i) => ({
    id: `evt-4-img-${i}`,
    gradient: GRADIENTS[(i + 3) % GRADIENTS.length]
  }))
},
{
  id: 'evt-5',
  title: "Zayed's 8th Birthday — Abu Dhabi",
  date: 'October 2025',
  pkg: 'Party Starter',
  category: 'Birthday Parties',
  theme: 'Jungle Theme',
  photos: Array.from({
    length: 4
  }).map((_, i) => ({
    id: `evt-5-img-${i}`,
    gradient: GRADIENTS[(i + 4) % GRADIENTS.length]
  }))
}];

export function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPhotos, setLightboxPhotos] = useState<
    {
      id: string;
      gradient: string;
    }[]>(
    []);
  const filteredEvents = MOCK_EVENTS.filter(
    (evt) => activeFilter === 'All' || evt.category === activeFilter
  );
  const openLightbox = (
  photos: {
    id: string;
    gradient: string;
  }[],
  index: number) =>
  {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % lightboxPhotos.length);
    }
  };
  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length
      );
    }
  };
  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-24">
      {/* Hero */}
      <div className="bg-brand-navy py-16 px-4 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}>
          
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
            Our Gallery
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real smiles from real parties across the UAE. Explore our past
            setups and get inspired for your next event.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {CATEGORIES.map((filter) =>
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === filter ? 'bg-brand-pink text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
            
              {filter}
            </button>
          )}
        </div>

        {/* Events List */}
        <div className="space-y-20">
          {filteredEvents.map((evt, evtIdx) =>
          <motion.div
            key={evt.id}
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              margin: '-100px'
            }}
            transition={{
              duration: 0.5
            }}>
            
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading font-bold text-2xl text-brand-navy">
                      {evt.title}
                    </h2>
                    {evt.theme &&
                  <span className="px-3 py-1 bg-brand-light text-brand-pink text-xs font-bold uppercase tracking-wider rounded-full">
                        {evt.theme}
                      </span>
                  }
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1.5 text-brand-blue" />
                      {evt.date}
                    </span>
                    <span className="flex items-center">
                      <PackageIcon className="w-4 h-4 mr-1.5 text-brand-pink" />
                      {evt.pkg}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {evt.photos.map((photo, idx) =>
              <motion.div
                key={photo.id}
                whileHover={{
                  scale: 1.02
                }}
                whileTap={{
                  scale: 0.98
                }}
                onClick={() => openLightbox(evt.photos, idx)}
                className={`rounded-xl bg-gradient-to-br ${photo.gradient} aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all relative group overflow-hidden`}>
                
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/50 px-4 py-2 rounded-full transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        View
                      </span>
                    </div>
                  </motion.div>
              )}
              </div>
            </motion.div>
          )}

          {filteredEvents.length === 0 &&
          <div className="text-center py-20 text-gray-500">
              No events found for this category.
            </div>
          }
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={closeLightbox}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          
            <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors z-10">
            
              <XIcon className="w-6 h-6" />
            </button>

            <button
            onClick={prevPhoto}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
            
              <ChevronLeftIcon className="w-8 h-8" />
            </button>

            <motion.div
            key={lightboxIndex}
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.9
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            className={`w-full max-w-4xl aspect-video md:aspect-square lg:aspect-video rounded-2xl shadow-2xl bg-gradient-to-br ${lightboxPhotos[lightboxIndex].gradient}`}
            onClick={(e) => e.stopPropagation()} />
          

            <button
            onClick={nextPhoto}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10">
            
              <ChevronRightIcon className="w-8 h-8" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {lightboxPhotos.length}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </main>);

}