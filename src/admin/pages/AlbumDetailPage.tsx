import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon, UploadIcon, TrashIcon,
  StarIcon, Loader2Icon, ImageIcon, XIcon,
  CheckCircleIcon, AlertTriangleIcon, EyeIcon,
  EyeOffIcon, RefreshCwIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';
import imageCompression from 'browser-image-compression';

// ─── Constants ───────────────────────────────────────────────────────────────
const MAX_FILES_PER_BATCH = 30;
const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30MB
const MIN_COMPRESS_SIZE = 300 * 1024; // 300KB — skip compression below this
const PHOTOS_PER_PAGE = 48;
const SUPABASE_FREE_TIER_BYTES = 1024 * 1024 * 1024; // 1GB

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const supportsWebP = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
};

const getTargetFormat = (file: File): string => {
  const isPNG = file.type === 'image/png' ||
    file.name.toLowerCase().endsWith('.png');
  if (isPNG) return 'image/png';
  return supportsWebP() ? 'image/webp' : 'image/jpeg';
};

const getExtension = (format: string): string => {
  const map: Record<string, string> = {
    'image/webp': 'webp',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/heic': 'jpg',
  };
  return map[format] || 'jpg';
};

const getStoragePath = (url: string): string | null => {
  try {
    const marker = '/object/public/gallery/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.substring(idx + marker.length).split('?')[0]);
  } catch {
    return null;
  }
};

const buildFileName = (albumId: string, file: File, format: string): string => {
  const ext = getExtension(format);
  const base = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .slice(0, 30) || 'photo';
  const random = Math.random().toString(36).slice(2, 8);
  return `albums/${albumId}/${Date.now()}-${random}-${base}.${ext}`;
};

const isMobile = (): boolean => /Mobi|Android/i.test(navigator.userAgent);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Photo {
  id: string;
  album_id: string;
  url: string;
  caption: string;
  sort_order: number;
  file_size_bytes: number;
  created_at: string;
}

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
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMountedRef = useRef(true);
  const uploadingRef = useRef(false);

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [page, setPage] = useState(1);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);

  // Keep uploadingRef in sync
  useEffect(() => {
    uploadingRef.current = uploading;
  }, [uploading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  // Warn before leaving during upload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadingRef.current) {
        e.preventDefault();
        e.returnValue = 'Upload in progress. Leaving now will cancel remaining uploads.';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Fetch data
  useEffect(() => {
    if (albumId) fetchData();
  }, [albumId]);

  const fetchData = async () => {
    if (!albumId) return;
    setLoading(true);
    setFetchError(false);

    const [albumRes, photosRes] = await Promise.allSettled([
      supabase.from('gallery_albums').select('*').eq('id', albumId).single(),
      supabase.from('gallery_photos').select('*').eq('album_id', albumId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true }),
    ]);

    if (!isMountedRef.current) return;

    if (albumRes.status === 'fulfilled' && albumRes.value.data) {
      setAlbum(albumRes.value.data);
    } else {
      setFetchError(true);
    }

    if (photosRes.status === 'fulfilled' && photosRes.value.data) {
      setPhotos(photosRes.value.data);
    }

    setLoading(false);
  };

  // Sync photo count + total size from actual DB records
  const syncAlbumStats = async () => {
    if (!albumId) return;
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('file_size_bytes')
      .eq('album_id', albumId);

    if (error || !data) return;

    const count = data.length;
    const totalSize = data.reduce((sum, p) => sum + (Number(p.file_size_bytes) || 0), 0);

    await supabase.from('gallery_albums')
      .update({
        photo_count: count,
        total_size_bytes: totalSize,
        is_published: count > 0 ? undefined : false,
      })
      .eq('id', albumId);

    if (!isMountedRef.current) return;
    setAlbum(prev => prev ? {
      ...prev,
      photo_count: count,
      total_size_bytes: totalSize,
      is_published: count === 0 ? false : prev.is_published,
    } : prev);
  };

  // File upload handler
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = Array.from(e.target.files || []);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (rawFiles.length === 0) return;
    if (!albumId) {
      setErrors(['Album ID is missing. Please refresh the page.']);
      return;
    }

    setErrors([]);
    setWarnings([]);
    setFailedFiles([]);
    setSuccessMsg('');

    // Limit batch size
    if (rawFiles.length > MAX_FILES_PER_BATCH) {
      setErrors([`Maximum ${MAX_FILES_PER_BATCH} photos per upload. You selected ${rawFiles.length}. Please upload in batches.`]);
      return;
    }

    // Separate valid/invalid
    const validFiles = rawFiles.filter(f =>
      VALID_TYPES.includes(f.type) || f.name.toLowerCase().endsWith('.heic')
    );
    const invalidFiles = rawFiles.filter(f =>
      !VALID_TYPES.includes(f.type) && !f.name.toLowerCase().endsWith('.heic')
    );

    if (invalidFiles.length > 0) {
      setWarnings([`Skipped ${invalidFiles.length} unsupported file(s): ${invalidFiles.map(f => f.name).join(', ')}`]);
    }

    if (validFiles.length === 0) {
      setErrors(['No valid image files selected.']);
      return;
    }

    // Deduplicate by name + size
    const seen = new Set<string>();
    const deduplicated = validFiles.filter(f => {
      const key = `${f.name}-${f.size}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (deduplicated.length < validFiles.length) {
      setWarnings(prev => [...prev,
        `Removed ${validFiles.length - deduplicated.length} duplicate file(s).`
      ]);
    }

    // Validate each file
    const checkedFiles: File[] = [];
    const sizeErrors: string[] = [];

    for (const file of deduplicated) {
      if (file.size === 0) {
        sizeErrors.push(`${file.name} is empty and was skipped.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        sizeErrors.push(`${file.name} is too large (${formatBytes(file.size)}). Max 30MB per file.`);
        continue;
      }
      checkedFiles.push(file);
    }

    if (sizeErrors.length > 0) {
      setErrors(prev => [...prev, ...sizeErrors]);
    }

    if (checkedFiles.length === 0) {
      return;
    }

    // Start upload
    setUploading(true);
    setUploadProgress({ current: 0, total: checkedFiles.length });

    const chunkSize = isMobile() ? 1 : 3;
    const newPhotos: Photo[] = [];
    const failed: string[] = [];

    for (let i = 0; i < checkedFiles.length; i += chunkSize) {
      if (!isMountedRef.current) break;

      const chunk = checkedFiles.slice(i, i + chunkSize);

      const results = await Promise.allSettled(
        chunk.map(async (file, chunkIdx) => {
          const targetFormat = getTargetFormat(file);
          const isHEIC = file.name.toLowerCase().endsWith('.heic');
          const shouldCompress = file.size > MIN_COMPRESS_SIZE || isHEIC;

          let finalFile: File | Blob = file;
          let finalSize = file.size;

          if (shouldCompress) {
            const options = {
              maxSizeMB: 0.5,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              fileType: targetFormat,
              initialQuality: 0.85,
            };

            // Timeout after 30 seconds
            const compressionWithTimeout = async () => {
              const timeout = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Compression timed out after 30s')), 30000)
              );
              return Promise.race([imageCompression(file, options), timeout]);
            };

            const compressed = await compressionWithTimeout();

            if (compressed.size === 0) {
              throw new Error('Compression produced empty file');
            }

            // Use compressed only if smaller
            finalFile = compressed.size < file.size ? compressed : file;
            finalSize = finalFile.size;
          }

          const fileName = buildFileName(albumId, file, targetFormat);

          // Upload to Storage
          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, finalFile, {
              contentType: targetFormat,
              upsert: false,
            });

          if (uploadError) {
            // Retry once on 429 rate limit
            if (uploadError.message?.includes('429') ||
              (uploadError as any)?.statusCode === '429') {
              await new Promise(r => setTimeout(r, 2000));
              const { error: retryError } = await supabase.storage
                .from('gallery')
                .upload(fileName, finalFile, {
                  contentType: targetFormat,
                  upsert: false,
                });
              if (retryError) throw retryError;
            } else {
              throw uploadError;
            }
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          if (!urlData?.publicUrl) {
            await supabase.storage.from('gallery').remove([fileName]);
            throw new Error('Failed to get public URL');
          }

          // Save to DB
          const { data: photoData, error: dbError } = await supabase
            .from('gallery_photos')
            .insert({
              album_id: albumId,
              url: urlData.publicUrl,
              sort_order: Date.now() * 10 + chunkIdx,
              file_size_bytes: finalSize,
            })
            .select()
            .single();

          if (dbError) {
            // Try to clean up storage
            await supabase.storage.from('gallery').remove([fileName]);
            throw dbError;
          }

          return photoData as Photo;
        })
      );

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && result.value) {
          newPhotos.push(result.value);
        } else {
          const fileName = chunk[idx]?.name || 'Unknown file';
          failed.push(fileName);
          console.error('Upload failed for:', fileName,
            result.status === 'rejected' ? result.reason : 'Unknown error'
          );
        }
      });

      if (isMountedRef.current) {
        setUploadProgress({
          current: Math.min(i + chunkSize, checkedFiles.length),
          total: checkedFiles.length,
        });
      }
    }

    if (!isMountedRef.current) return;

    // Update photos state
    if (newPhotos.length > 0) {
      setPhotos(prev => [...prev, ...newPhotos]);
    }

    // Set cover if first upload and no cover yet
    if (album && !album.cover_url && newPhotos.length > 0) {
      const firstPhoto = newPhotos[0];
      await supabase.from('gallery_albums')
        .update({ cover_url: firstPhoto.url })
        .eq('id', albumId);
      if (isMountedRef.current) {
        setAlbum(prev => prev ? { ...prev, cover_url: firstPhoto.url } : prev);
      }
    }

    // Sync stats
    await syncAlbumStats();

    // Report results
    if (failed.length > 0) {
      setFailedFiles(failed);
      setErrors(prev => [...prev,
        `${failed.length} photo(s) failed to upload: ${failed.join(', ')}`
      ]);
    }

    if (newPhotos.length > 0) {
      setSuccessMsg(
        `${newPhotos.length} photo(s) uploaded successfully!` +
        (!album?.is_published ? ' Don\'t forget to publish the album.' : '')
      );
    }

    setUploading(false);
  }, [albumId, album]);

  // Set cover photo
  const setCover = async (photo: Photo) => {
    if (!albumId) return;
    const { error } = await supabase
      .from('gallery_albums')
      .update({ cover_url: photo.url })
      .eq('id', albumId);

    if (error) {
      setErrors(['Failed to set cover photo. Please try again.']);
      return;
    }
    setAlbum(prev => prev ? { ...prev, cover_url: photo.url } : prev);
    setSuccessMsg('Cover photo updated!');
    setTimeout(() => {
      if (isMountedRef.current) setSuccessMsg('');
    }, 3000);
  };

  // Delete photo
  const handleDeletePhoto = async () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);

    const photo = photos.find(p => p.id === confirmDeleteId);
    if (!photo) {
      setDeletingId(null);
      return;
    }

    // Delete from Storage
    const storagePath = getStoragePath(photo.url);
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([storagePath]);
      if (storageError) {
        console.error('Storage delete failed (orphaned file):', storagePath, storageError);
      }
    } else {
      console.error('Could not extract storage path:', photo.url);
    }

    // Always delete from DB
    const { error: dbError } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', confirmDeleteId);

    if (dbError) {
      setErrors(['Failed to delete photo from database. Please try again.']);
      setDeletingId(null);
      return;
    }

    const newPhotos = photos.filter(p => p.id !== confirmDeleteId);

    if (!isMountedRef.current) return;
    setPhotos(newPhotos);

    // If deleted was cover, promote next photo
    const updates: Partial<Album> = {};
    if (photo.url === album?.cover_url) {
      updates.cover_url = newPhotos.length > 0 ? newPhotos[0].url : null;
    }

    // If no photos left, unpublish
    if (newPhotos.length === 0) {
      updates.is_published = false;
      updates.cover_url = null;
    }

    if (Object.keys(updates).length > 0) {
      await supabase.from('gallery_albums').update(updates).eq('id', albumId);
      setAlbum(prev => prev ? { ...prev, ...updates } : prev);
    }

    await syncAlbumStats();
    setDeletingId(null);
    setSuccessMsg('Photo deleted.');
    setTimeout(() => {
      if (isMountedRef.current) setSuccessMsg('');
    }, 3000);
  };

  // Toggle publish
  const togglePublish = async () => {
    if (!album || !albumId) return;
    if (!album.is_published && photos.length === 0) {
      setErrors(['Cannot publish an empty album. Upload photos first.']);
      return;
    }

    setPublishing(true);
    const newValue = !album.is_published;

    // Optimistic update
    setAlbum(prev => prev ? { ...prev, is_published: newValue } : prev);

    const { error } = await supabase
      .from('gallery_albums')
      .update({ is_published: newValue })
      .eq('id', albumId);

    if (error) {
      // Revert
      setAlbum(prev => prev ? { ...prev, is_published: !newValue } : prev);
      setErrors(['Failed to update. Please try again.']);
    } else {
      setSuccessMsg(newValue
        ? '✅ Album is now LIVE on the public gallery!'
        : '🔒 Album is now hidden from the public gallery.'
      );
      setTimeout(() => {
        if (isMountedRef.current) setSuccessMsg('');
      }, 4000);
    }

    if (isMountedRef.current) setPublishing(false);
  };

  // Visible photos (pagination)
  const visiblePhotos = photos.slice(0, page * PHOTOS_PER_PAGE);
  const hasMore = photos.length > page * PHOTOS_PER_PAGE;

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (fetchError || !album) {
    return (
      <div className="text-center py-12">
        <AlertTriangleIcon className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <p className="text-slate-400 mb-4">
          {fetchError ? 'Failed to load album. Check your connection.' : 'Album not found.'}
        </p>
        <div className="flex gap-3 justify-center">
          {fetchError && (
            <Button variant="outline" onClick={fetchData}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
          <Link to="/admin/gallery">
            <Button variant="outline">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const storagePercent = Math.min(
    100,
    Math.round((album.total_size_bytes / SUPABASE_FREE_TIER_BYTES) * 100)
  );

  return (
    <div className="space-y-6 max-w-6xl pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Link
          to="/admin/gallery"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-heading font-bold text-slate-100 truncate">
            {album.title}
          </h2>
          <p className="text-sm text-slate-400">
            {album.location} • {album.event_date} •{' '}
            {photos.length} photo{photos.length !== 1 ? 's' : ''} •{' '}
            {formatBytes(album.total_size_bytes)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Publish Toggle */}
          <Button
            variant={album.is_published ? 'outline' : 'primary'}
            onClick={togglePublish}
            disabled={publishing}
            className={album.is_published
              ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }
          >
            {publishing ? (
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            ) : album.is_published ? (
              <EyeIcon className="w-4 h-4 mr-2" />
            ) : (
              <EyeOffIcon className="w-4 h-4 mr-2" />
            )}
            {album.is_published ? 'Published' : 'Publish Album'}
          </Button>

          {/* Upload Button */}
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
            {uploading
              ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...`
              : 'Upload Photos'
            }
          </Button>
        </div>
      </div>

      {/* Unpublished Banner */}
      {!album.is_published && photos.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EyeOffIcon className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-amber-400 font-medium text-sm">
                This album is not published
              </p>
              <p className="text-amber-400/70 text-xs">
                Customers cannot see it on the public gallery yet.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
            onClick={togglePublish}
            disabled={publishing}
          >
            Publish Now
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-brand-blue font-medium">
              Compressing & uploading photos...
            </p>
            <p className="text-sm text-brand-blue font-bold">
              {uploadProgress.current}/{uploadProgress.total}
            </p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div
              className="bg-brand-blue h-2.5 rounded-full transition-all duration-300"
              style={{
                width: uploadProgress.total > 0
                  ? `${(uploadProgress.current / uploadProgress.total) * 100}%`
                  : '0%'
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Please don't close this page while uploading.
          </p>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-400 font-medium">{successMsg}</p>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangleIcon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="text-sm text-rose-400">{err}</p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setErrors([])}
              className="text-rose-400 hover:text-rose-300 ml-4"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangleIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {warnings.map((w, i) => (
                  <p key={i} className="text-sm text-amber-400">{w}</p>
                ))}
              </div>
            </div>
            <button
              onClick={() => setWarnings([])}
              className="text-amber-400 hover:text-amber-300 ml-4"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cover Info */}
      {photos.length > 0 && (
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4 text-sm text-slate-400 flex items-center gap-2">
          <StarIcon className="w-4 h-4 text-amber-400 shrink-0" />
          Hover over any photo and click the star to set it as the album cover.
        </div>
      )}

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div
          className="border-2 border-dashed border-slate-700 rounded-2xl p-16 text-center cursor-pointer hover:border-brand-blue/50 transition-colors"
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <ImageIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-2">No photos yet</p>
          <p className="text-slate-500 text-sm mb-6">
            Click to upload photos (JPG, PNG, WebP, HEIC)
          </p>
          <Button disabled={uploading}>
            <UploadIcon className="w-4 h-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {visiblePhotos.map((photo) => {
              const isCover = photo.url === album.cover_url;
              const isDeleting = deletingId === photo.id;

              return (
                <div
                  key={photo.id}
                  className={`group relative aspect-square rounded-xl overflow-hidden bg-slate-800 ${isDeleting ? 'opacity-50' : ''}`}
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-slate-600 flex-col gap-2">
                            <span class="text-2xl">⚠️</span>
                            <span class="text-xs">Failed to load</span>
                          </div>
                        `;
                      }
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all" />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-md font-medium z-10">
                      Cover
                    </div>
                  )}

                  {/* Size Badge */}
                  {photo.file_size_bytes > 0 && (
                    <div className="absolute bottom-2 right-2 bg-slate-900/70 text-slate-300 text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatBytes(photo.file_size_bytes)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all z-20">
                    {/* Set Cover */}
                    <button
                      onClick={() => setCover(photo)}
                      title="Set as cover"
                      disabled={isDeleting}
                      className={`p-2 rounded-full transition-colors ${
                        isCover
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-900/80 text-slate-300 hover:bg-amber-500 hover:text-white'
                      }`}
                    >
                      <StarIcon className="w-5 h-5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => !isDeleting && setConfirmDeleteId(photo.id)}
                      disabled={isDeleting}
                      className="p-2 bg-slate-900/80 text-rose-400 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                    >
                      {isDeleting
                        ? <Loader2Icon className="w-5 h-5 animate-spin" />
                        : <TrashIcon className="w-5 h-5" />
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
              >
                Load More ({photos.length - visiblePhotos.length} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <ConfirmModal
          title="Delete Photo"
          message="Are you sure you want to delete this photo? This cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDeletePhoto}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}