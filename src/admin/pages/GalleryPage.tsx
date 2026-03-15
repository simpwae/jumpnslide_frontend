import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon, StarIcon, TrashIcon,
  ImageIcon, Loader2Icon, MapPinIcon,
  CalendarIcon
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { EditModal } from '../components/ui/EditModal';
import { supabase } from '../../lib/supabase';

const CATEGORIES = [
  'birthday', 'splash', 'theme', 'gender-reveal',
  'anniversary', 'school', 'eid'
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

const EMIRATES = [
  'Ras Al Khaimah', 'Dubai', 'Sharjah', 'Ajman',
  'Umm Al Quwain', 'Abu Dhabi', 'Fujairah'
];

const MAX_FEATURED = 6;

interface Album {
  id: string;
  title: string;
  category: string;
  event_date: string;
  location: string;
  cover_url: string;
  is_featured: boolean;
  photo_count: number;
  created_at: string;
}

export function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Add form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('birthday');
  const [newLocation, setNewLocation] = useState('Ras Al Khaimah');
  const [newDate, setNewDate] = useState('');

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_albums')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAlbums(data);
    setLoading(false);
  };

  const featuredCount = albums.filter(a => a.is_featured).length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('gallery_albums')
      .insert({
        title: newTitle,
        category: newCategory,
        location: newLocation,
        event_date: newDate,
        is_featured: false,
        photo_count: 0,
      })
      .select().single();
    if (!error && data) {
      setAlbums(prev => [data, ...prev]);
      setNewTitle(''); setNewCategory('birthday');
      setNewLocation('Ras Al Khaimah'); setNewDate('');
      setShowAddModal(false);
    }
    setSaving(false);
  };

  const toggleFeatured = async (album: Album) => {
    if (!album.is_featured && featuredCount >= MAX_FEATURED) {
      alert(`Maximum ${MAX_FEATURED} featured albums allowed. Please unfeature one first.`);
      return;
    }
    const { error } = await supabase
      .from('gallery_albums')
      .update({ is_featured: !album.is_featured })
      .eq('id', album.id);
    if (!error) {
      setAlbums(prev => prev.map(a =>
        a.id === album.id ? { ...a, is_featured: !a.is_featured } : a
      ));
    }
  };

  const handleDelete = (id: string) => setConfirmDelete(id);

  const confirmDeleteAlbum = async () => {
    if (!confirmDelete) return;
    // Delete all photos from storage first
    const album = albums.find(a => a.id === confirmDelete);
    if (album) {
      const { data: photos } = await supabase
        .from('gallery_photos')
        .select('url')
        .eq('album_id', confirmDelete);
      if (photos && photos.length > 0) {
        const paths = photos.map(p => {
          const url = p.url;
          const parts = url.split('/gallery/');
          return parts[1] || '';
        }).filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from('gallery').remove(paths);
        }
      }
    }
    const { error } = await supabase
      .from('gallery_albums')
      .delete()
      .eq('id', confirmDelete);
    if (!error) setAlbums(prev => prev.filter(a => a.id !== confirmDelete));
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">Gallery Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            {albums.length} albums · {featuredCount}/{MAX_FEATURED} featured
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </div>

      {/* Featured Warning */}
      {featuredCount >= MAX_FEATURED && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-400">
          ⚠️ Maximum featured albums reached ({MAX_FEATURED}). Unfeature an album before featuring a new one.
        </div>
      )}

      {albums.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-2">No albums yet</p>
          <p className="text-slate-500 text-sm mb-6">Create your first event album to get started.</p>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />Create First Album
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Card key={album.id} className="group overflow-hidden hover:border-slate-600 transition-all">
              {/* Cover Photo */}
              <div className="relative h-48 bg-slate-800">
                {album.cover_url ? (
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <p className="text-xs">No photos yet</p>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                {/* Featured Star */}
                <button
                  onClick={() => toggleFeatured(album)}
                  title={album.is_featured ? 'Unfeature' : featuredCount >= MAX_FEATURED ? 'Max featured reached' : 'Feature this album'}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${album.is_featured ? 'bg-amber-500 text-white' : 'bg-slate-900/70 text-slate-400 hover:text-amber-400'} ${!album.is_featured && featuredCount >= MAX_FEATURED ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <StarIcon className={`w-4 h-4 ${album.is_featured ? 'fill-current' : ''}`} />
                </button>

                {/* Photo Count */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {album.photo_count} photos
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-blue/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                    {CATEGORY_LABELS[album.category] || album.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-4">
                <h3 className="font-heading font-bold text-slate-100 mb-1 truncate" title={album.title}>
                  {album.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
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
                  <Link to={`/admin/gallery/${album.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Photos
                    </Button>
                  </Link>
                  <Button
                    variant="ghost" size="sm"
                    className="px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                    onClick={() => handleDelete(album.id)}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Album Modal */}
      {showAddModal && (
        <EditModal title="Create New Album" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Album Title</label>
              <input
                required value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Unicorn Birthday Party"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Location</label>
                <select value={newLocation} onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">
                Event Date <span className="text-slate-500 font-normal">(e.g. March 2026)</span>
              </label>
              <input
                type="text" value={newDate}
                onChange={e => setNewDate(e.target.value)}
                placeholder="March 2026"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create Album'}
              </Button>
            </div>
          </form>
        </EditModal>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Album"
          message="This will permanently delete the album and ALL its photos. This cannot be undone."
          confirmLabel="Delete"
          onConfirm={confirmDeleteAlbum}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}