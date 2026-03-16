import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon, StarIcon, TrashIcon,
  ImageIcon, Loader2Icon, MapPinIcon,
  CalendarIcon, HardDriveIcon
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { EditModal } from '../components/ui/EditModal';
import { supabase } from '../../lib/supabase';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Constants ────────────────────────────────────────────────────────────────
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
const STORAGE_LIMIT = 1024 * 1024 * 1024; // 1GB

// ─── Types ────────────────────────────────────────────────────────────────────
interface Album {
  id: string;
  title: string;
  category: string;
  event_date: string;
  location: string;
  cover_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  photo_count: number;
  total_size_bytes: number;
  created_at: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
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

  // ── Derived stats ──────────────────────────────────────────────────────────
  const featuredCount = albums.filter(a => a.is_featured).length;
  const totalUsed = albums.reduce((sum, a) => sum + (Number(a.total_size_bytes) || 0), 0);
  const storagePercent = Math.min(100, (totalUsed / STORAGE_LIMIT) * 100);

  const getStorageBarColor = () => {
    if (storagePercent >= 95) return 'bg-rose-500';
    if (storagePercent >= 85) return 'bg-orange-500';
    if (storagePercent >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStorageTextColor = () => {
    if (storagePercent >= 95) return 'text-rose-400';
    if (storagePercent >= 85) return 'text-orange-400';
    if (storagePercent >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
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
        is_published: false,
        photo_count: 0,
        total_size_bytes: 0,
      })
      .select()
      .single();
    if (!error && data) {
      setAlbums(prev => [data, ...prev]);
      setNewTitle('');
      setNewCategory('birthday');
      setNewLocation('Ras Al Khaimah');
      setNewDate('');
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

    // Delete photos from Storage in batches
    const { data: photos } = await supabase
      .from('gallery_photos')
      .select('url')
      .eq('album_id', confirmDelete);

    if (photos && photos.length > 0) {
      const paths = photos
        .map(p => {
          try {
            const marker = '/object/public/gallery/';
            const idx = p.url.indexOf(marker);
            if (idx === -1) return '';
            return decodeURIComponent(p.url.substring(idx + marker.length).split('?')[0]);
          } catch {
            return '';
          }
        })
        .filter(Boolean);

      // Delete in batches of 20
      for (let i = 0; i < paths.length; i += 20) {
        const batch = paths.slice(i, i + 20);
        await supabase.storage.from('gallery').remove(batch);
      }
    }

    const { error } = await supabase
      .from('gallery_albums')
      .delete()
      .eq('id', confirmDelete);

    if (!error) setAlbums(prev => prev.filter(a => a.id !== confirmDelete));
    setConfirmDelete(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Gallery Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {albums.length} albums · {featuredCount}/{MAX_FEATURED} featured · {formatBytes(totalUsed)} used
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Album
        </Button>
      </div>

      {/* Storage Bar */}
      {totalUsed > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDriveIcon className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300 font-medium">Storage</span>
            </div>
            <span className={`text-sm font-bold ${getStorageTextColor()}`}>
              {formatBytes(totalUsed)} / 1 GB
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getStorageBarColor()}`}
              style={{ width: `${Math.max(storagePercent, 0.5)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500">{storagePercent.toFixed(1)}% used</span>
            <span className="text-xs text-slate-500">
              {formatBytes(STORAGE_LIMIT - totalUsed)} free
            </span>
          </div>
          {storagePercent >= 70 && (
            <p className={`text-xs mt-2 font-medium ${getStorageTextColor()}`}>
              {storagePercent >= 95
                ? '🔴 Storage critically full. Delete old photos immediately.'
                : storagePercent >= 85
                ? '🟠 Storage almost full. Consider deleting old event photos.'
                : '🟡 Storage getting full. Monitor usage.'}
            </p>
          )}
        </div>
      )}

      {/* Featured Warning */}
      {featuredCount >= MAX_FEATURED && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-400">
          ⚠️ Maximum featured albums reached ({MAX_FEATURED}). Unfeature an album before featuring a new one.
        </div>
      )}

      {/* Empty State */}
      {albums.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-2">No albums yet</p>
          <p className="text-slate-500 text-sm mb-6">
            Create your first event album to get started.
          </p>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create First Album
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="group overflow-hidden hover:border-slate-600 transition-all"
            >
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
                  title={
                    album.is_featured
                      ? 'Unfeature'
                      : featuredCount >= MAX_FEATURED
                      ? 'Max featured reached'
                      : 'Feature this album'
                  }
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
                    album.is_featured
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-900/70 text-slate-400 hover:text-amber-400'
                  } ${
                    !album.is_featured && featuredCount >= MAX_FEATURED
                      ? 'opacity-40 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <StarIcon className={`w-4 h-4 ${album.is_featured ? 'fill-current' : ''}`} />
                </button>

                {/* Top Left Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                  {/* Category */}
                  <span className="bg-brand-blue/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                    {CATEGORY_LABELS[album.category] || album.category}
                  </span>
                  {/* Published Status */}
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium backdrop-blur-sm ${
                    album.is_published
                      ? 'bg-emerald-500/80 text-white'
                      : 'bg-slate-900/80 text-amber-400'
                  }`}>
                    {album.is_published ? '● Live' : '○ Draft'}
                  </span>
                </div>

                {/* Photo Count */}
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {album.photo_count} photos
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-4">
                <h3
                  className="font-heading font-bold text-slate-100 mb-1 truncate"
                  title={album.title}
                >
                  {album.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
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

                {/* Storage Size */}
                {album.total_size_bytes > 0 && (
                  <p className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                    <HardDriveIcon className="w-3 h-3" />
                    {formatBytes(album.total_size_bytes)}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <Link to={`/admin/gallery/${album.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Photos
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
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
              <label className="text-sm font-medium text-slate-300 block mb-1">
                Album Title
              </label>
              <input
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Unicorn Birthday Party"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">
                  Location
                </label>
                <select
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {EMIRATES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">
                Event Date{' '}
                <span className="text-slate-500 font-normal">(e.g. March 2026)</span>
              </label>
              <input
                type="text"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                placeholder="March 2026"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create Album'}
              </Button>
            </div>
          </form>
        </EditModal>
      )}

      {/* Delete Confirm Modal */}
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