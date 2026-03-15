import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, MapPinIcon, CalendarIcon, ShareIcon } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'birthday', label: 'Birthday Parties' },
  { id: 'splash', label: 'Splash Events' },
  { id: 'theme', label: 'Theme Parties' },
  { id: 'gender-reveal', label: 'Gender Reveal' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'school', label: 'School Events' },
  { id: 'eid', label: 'Eid Celebrations' },
];

const CATEGORY_LABELS: Record<string, string> = {
  birthday: 'Birthday Party',
  splash: 'Splash Event',
  theme: 'Theme Party',
  'gender-reveal': 'Gender Reveal',
  anniversary: 'Anniversary',
  school: 'School Event',
  eid: 'Eid Celebration',
};

interface Album {
  id: string;
  title: string;
  category: string;
  event_date: string;
  location: string;
  cover_url: string;
  is_featured: boolean;
  photo_count: number;
}

interface Photo {
  id: string;
  url: string;
  caption: string;
}

export function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_albums')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      // Only show albums with at least 1 photo
      setAlbums(data.filter(a => a.photo_count > 0));
    }
    setLoading(false);
  };

  const openAlbum = async (album: Album) => {
    setSelectedAlbum(album);
    setLoadingPhotos(true);
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('album_id', album.id)
      .order('sort_order', { ascending: true });
    if (!error && data) setAlbumPhotos(data);
    setLoadingPhotos(false);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleShare = async (album: Album) => {
    const url = `${window.location.origin}/gallery?album=${album.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${album.title} — Jump N Slide 4 Kids`,
          text: `Check out this amazing party by Jump N Slide 4 Kids!`,
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredAlbums = activeCategory === 'all'
    ? albums
    : albums.filter(a => a.category === activeCategory);

  const featuredAlbums = filteredAlbums.filter(a => a.is_featured);
  const regularAlbums = filteredAlbums.filter(a => !a.is_featured);

  const lightboxSlides = albumPhotos.map(p => ({ src: p.url }));

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-24">

      {/* Hero */}
      <div className="bg-brand-navy py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading font-bold text-4xl md:text-5xl text-white mb-4"
        >
          Our Events Gallery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 text-lg max-w-2xl mx-auto"
        >
          Browse through our past events and see the magic we create for families across the UAE.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">No events yet in this category</p>
            <p className="text-gray-400">Check back soon — we're always creating amazing memories!</p>
          </div>
        ) : (
          <>
            {/* Featured Albums */}
            {featuredAlbums.length > 0 && (
              <div className="mb-12">
                {activeCategory === 'all' && (
                  <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                    ✨ Featured Events
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredAlbums.map((album, i) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      featured
                      index={i}
                      onOpen={() => openAlbum(album)}
                      onShare={() => handleShare(album)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Albums */}
            {regularAlbums.length > 0 && (
              <div>
                {featuredAlbums.length > 0 && activeCategory === 'all' && (
                  <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                    All Events
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {regularAlbums.map((album, i) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      featured={false}
                      index={i}
                      onOpen={() => openAlbum(album)}
                      onShare={() => handleShare(album)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Copy URL Toast */}
        {copied && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-navy text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium z-50">
            Album link copied! ✓
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => { setLightboxOpen(false); setSelectedAlbum(null); setAlbumPhotos([]); }}
          slides={lightboxSlides}
          index={lightboxIndex}
          plugins={[Thumbnails, Counter]}
          thumbnails={{ position: 'bottom', width: 80, height: 60 }}
          counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
          styles={{
            container: { backgroundColor: 'rgba(0,0,0,0.95)' },
          }}
        />
      )}

      {/* Loading Photos Overlay */}
      {loadingPhotos && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading album...</p>
          </div>
        </div>
      )}
    </main>
  );
}

// Album Card Component
interface AlbumCardProps {
  album: Album;
  featured: boolean;
  index: number;
  onOpen: () => void;
  onShare: () => void;
}

function AlbumCard({ album, featured, index, onOpen, onShare }: AlbumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-brand-blue/20 cursor-pointer ${featured ? 'md:col-span-1' : ''}`}
    >
      {/* Cover Photo */}
      <div
        className={`relative overflow-hidden bg-gray-200 ${featured ? 'h-64' : 'h-48'}`}
        onClick={onOpen}
      >
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-blue/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {CATEGORY_LABELS[album.category] || album.category}
          </span>
        </div>

        {/* Photo Count */}
        <div className="absolute bottom-3 left-3 text-white text-sm font-medium flex items-center gap-1">
          <ImageIcon className="w-4 h-4" />
          {album.photo_count} photos
        </div>

        {/* View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/90 backdrop-blur-sm text-brand-navy font-bold px-5 py-2 rounded-full text-sm">
            View Album
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3
          className="font-heading font-bold text-brand-navy mb-1 line-clamp-1"
          title={album.title}
          onClick={onOpen}
        >
          {album.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          {album.location && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />{album.location}
            </span>
          )}
          {album.event_date && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />{album.event_date}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpen}
            className="flex-1 py-2 bg-brand-navy text-white rounded-xl text-sm font-medium hover:bg-brand-blue transition-colors"
          >
            View Photos
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-colors"
            title="Share album"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}