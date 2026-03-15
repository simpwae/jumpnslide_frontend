import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon, UploadIcon, TrashIcon,
  StarIcon, Loader2Icon, ImageIcon, XIcon
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';

interface Photo {
  id: string;
  album_id: string;
  url: string;
  caption: string;
  sort_order: number;
  created_at: string;
}

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

export function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (albumId) fetchData();
  }, [albumId]);

  const fetchData = async () => {
    setLoading(true);
    const [albumRes, photosRes] = await Promise.all([
      supabase.from('gallery_albums').select('*').eq('id', albumId).single(),
      supabase.from('gallery_photos').select('*').eq('album_id', albumId).order('sort_order', { ascending: true }),
    ]);
    if (albumRes.data) setAlbum(albumRes.data);
    if (photosRes.data) setPhotos(photosRes.data);
    setLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type) && !f.name.toLowerCase().endsWith('.heic'));
    if (invalidFiles.length > 0) {
      setError(`Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}. Only JPG, PNG, WebP, HEIC allowed.`);
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const compressionOptions = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    // Upload 3 at a time
    const chunkSize = 3;
    const newPhotos: Photo[] = [];

    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (file) => {
          try {
            // Compress
            const compressed = await imageCompression(file, compressionOptions);
            const timestamp = Date.now();
            const fileName = `albums/${albumId}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from('gallery')
              .upload(fileName, compressed, { contentType: 'image/jpeg', upsert: false });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('gallery')
              .getPublicUrl(fileName);

            // Save to database
            const { data: photoData, error: dbError } = await supabase
              .from('gallery_photos')
              .insert({
                album_id: albumId,
                url: urlData.publicUrl,
                sort_order: photos.length + newPhotos.length,
              })
              .select().single();

            if (dbError) throw dbError;
            return photoData;

          } catch (err) {
            console.error('Upload error:', err);
            return null;
          }
        })
      );

      const successful = chunkResults.filter(Boolean) as Photo[];
      newPhotos.push(...successful);
      setUploadProgress({ current: Math.min(i + chunkSize, files.length), total: files.length });
    }

    // Update photos state
    setPhotos(prev => [...prev, ...newPhotos]);

    // Update photo count + set cover if first upload
    const newCount = photos.length + newPhotos.length;
    const updates: any = { photo_count: newCount };
    if (!album?.cover_url && newPhotos.length > 0) {
      updates.cover_url = newPhotos[0].url;
      setAlbum(prev => prev ? { ...prev, cover_url: newPhotos[0].url, photo_count: newCount } : prev);
    } else {
      setAlbum(prev => prev ? { ...prev, photo_count: newCount } : prev);
    }

    await supabase.from('gallery_albums').update(updates).eq('id', albumId);

    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setCover = async (photo: Photo) => {
    const { error } = await supabase
      .from('gallery_albums')
      .update({ cover_url: photo.url })
      .eq('id', albumId);
    if (!error) setAlbum(prev => prev ? { ...prev, cover_url: photo.url } : prev);
  };

  const deletePhoto = async () => {
    if (!confirmDelete) return;
    const photo = photos.find(p => p.id === confirmDelete);
    if (!photo) return;

    // Remove from storage
    const parts = photo.url.split('/gallery/');
    if (parts[1]) {
      await supabase.storage.from('gallery').remove([parts[1]]);
    }

    // Remove from database
    await supabase.from('gallery_photos').delete().eq('id', confirmDelete);

    const newPhotos = photos.filter(p => p.id !== confirmDelete);
    setPhotos(newPhotos);

    // If deleted photo was cover, auto-set next photo as cover
    const updates: any = { photo_count: newPhotos.length };
    if (photo.url === album?.cover_url) {
      updates.cover_url = newPhotos.length > 0 ? newPhotos[0].url : null;
      setAlbum(prev => prev ? { ...prev, cover_url: updates.cover_url, photo_count: newPhotos.length } : prev);
    } else {
      setAlbum(prev => prev ? { ...prev, photo_count: newPhotos.length } : prev);
    }

    await supabase.from('gallery_albums').update(updates).eq('id', albumId);
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Album not found.</p>
        <Link to="/admin/gallery">
          <Button variant="outline">Back to Gallery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/gallery"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-heading font-bold text-slate-100">{album.title}</h2>
          <p className="text-sm text-slate-400">
            {album.location} • {album.event_date} • {album.photo_count} photos
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.heic"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {uploading ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : 'Upload Photos'}
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-brand-blue font-medium">
              Compressing & uploading photos...
            </p>
            <p className="text-sm text-brand-blue">
              {uploadProgress.current} / {uploadProgress.total}
            </p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-brand-blue h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress.total > 0 ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-rose-400">{error}</p>
          <button onClick={() => setError('')}>
            <XIcon className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      )}

      {/* Cover Info */}
      {photos.length > 0 && (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-sm text-slate-400">
          <span className="text-amber-400 mr-2">★</span>
          Click the star on any photo to set it as the album cover (shown in gallery grid).
        </div>
      )}

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div
          className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center cursor-pointer hover:border-brand-blue/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-2">No photos yet</p>
          <p className="text-slate-500 text-sm mb-6">Click to upload photos or drag and drop</p>
          <Button>
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-800">
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all" />

              {/* Cover Badge */}
              {photo.url === album.cover_url && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-md font-medium">
                  Cover
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => setCover(photo)}
                  title="Set as cover"
                  className={`p-2 rounded-full transition-colors ${photo.url === album.cover_url ? 'bg-amber-500 text-white' : 'bg-slate-900/80 text-slate-300 hover:bg-amber-500 hover:text-white'}`}
                >
                  <StarIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(photo.id)}
                  className="p-2 bg-slate-900/80 text-rose-400 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {confirmDelete && (
        <ConfirmModal
          title="Delete Photo"
          message="Are you sure you want to delete this photo? This cannot be undone."
          confirmLabel="Delete"
          onConfirm={deletePhoto}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}