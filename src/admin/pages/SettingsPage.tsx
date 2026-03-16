import React, { useState, useEffect } from 'react';
import { SaveIcon, Loader2Icon, HardDriveIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_LIMIT = 1024 * 1024 * 1024; // 1GB free tier

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// ─── Storage Usage Component ──────────────────────────────────────────────────
function StorageUsage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('gallery_albums')
      .select('id, title, total_size_bytes, photo_count, is_published')
      .order('total_size_bytes', { ascending: false })
      .then(({ data }) => {
        if (data) setAlbums(data);
        setLoading(false);
      });
  }, []);

  const totalUsed = albums.reduce(
    (sum, a) => sum + (Number(a.total_size_bytes) || 0), 0
  );
  const percentUsed = Math.min(100, (totalUsed / STORAGE_LIMIT) * 100);
  const remaining = STORAGE_LIMIT - totalUsed;

  const getBarColor = () => {
    if (percentUsed >= 95) return 'bg-rose-500';
    if (percentUsed >= 85) return 'bg-orange-500';
    if (percentUsed >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getTextColor = () => {
    if (percentUsed >= 95) return 'text-rose-400';
    if (percentUsed >= 85) return 'text-orange-400';
    if (percentUsed >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStatusMessage = () => {
    if (percentUsed >= 95) return '🔴 Storage critically full. Delete old event photos immediately or upgrade your Supabase plan.';
    if (percentUsed >= 85) return '🟠 Storage almost full. Consider deleting old event albums to free up space.';
    if (percentUsed >= 70) return '🟡 Storage getting full. Keep an eye on usage.';
    return '🟢 Storage is healthy.';
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
        <Loader2Icon className="w-4 h-4 animate-spin" />
        Calculating storage usage...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Overall Usage */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-300 font-medium">
            Gallery Photos Storage
          </span>
          <span className={`text-sm font-bold ${getTextColor()}`}>
            {formatBytes(totalUsed)} / {formatBytes(STORAGE_LIMIT)}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${Math.max(percentUsed, 0.3)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-slate-500">
            {percentUsed.toFixed(1)}% used
          </span>
          <span className="text-xs text-slate-500">
            {formatBytes(remaining)} free
          </span>
        </div>
      </div>

      {/* Status Message */}
      <div className={`text-sm font-medium ${getTextColor()} bg-slate-900/50 rounded-lg p-3 border border-slate-800`}>
        {getStatusMessage()}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-100">{albums.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total Albums</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-100">
            {albums.reduce((sum, a) => sum + (Number(a.photo_count) || 0), 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total Photos</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold ${getTextColor()}`}>
            {formatBytes(totalUsed)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Used</p>
        </div>
      </div>

      {/* Albums Breakdown */}
      {albums.filter(a => a.total_size_bytes > 0).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            Albums by Storage Usage
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {albums
              .filter(a => a.total_size_bytes > 0)
              .map(album => {
                const albumPercent = Math.min(
                  100,
                  (Number(album.total_size_bytes) / STORAGE_LIMIT) * 100
                );
                const albumOfTotal = totalUsed > 0
                  ? Math.round((Number(album.total_size_bytes) / totalUsed) * 100)
                  : 0;

                return (
                  <div key={album.id}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-slate-400 truncate">
                          {album.title}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
                          album.is_published
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {album.is_published ? 'Live' : 'Draft'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 shrink-0 ml-3">
                        {formatBytes(Number(album.total_size_bytes))} ·{' '}
                        {album.photo_count} photos ·{' '}
                        {albumOfTotal}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-brand-blue transition-all"
                        style={{ width: `${Math.max(albumPercent * 100 / Math.max(percentUsed, 1), 0.3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {albums.filter(a => a.total_size_bytes > 0).length === 0 && (
        <div className="text-center py-6 text-slate-500 text-sm">
          <HardDriveIcon className="w-8 h-8 mx-auto mb-2 text-slate-700" />
          No storage used yet. Upload photos to gallery albums to track usage here.
        </div>
      )}

      <p className="text-xs text-slate-600 border-t border-slate-800 pt-4">
        Storage tracking includes photos uploaded through this admin panel.
        Supabase free tier includes 1GB storage.
        To upgrade storage, visit your Supabase dashboard.
      </p>
    </div>
  );
}

// ─── Main SettingsPage ────────────────────────────────────────────────────────
export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    business_name: 'Jump N Slide 4 Kids',
    phone: '+971 50 647 7052',
    email: 'jumpnslide4kids@gmail.com',
    instagram: '@jumpnslide4kids',
    enable_bookings: true,
    enable_whatsapp: true,
    bank_name: 'Emirates NBD',
    account_name: 'Jump N Slide 4 Kids',
    iban: 'AE12 3456 7890 1234 5678 90',
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (!error && data) {
      setSettings({
        business_name: data.business_name,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram,
        enable_bookings: data.enable_bookings,
        enable_whatsapp: data.enable_whatsapp,
        bank_name: data.bank_name,
        account_name: data.account_name,
        iban: data.iban,
      });
      setSettingsId(data.id);
    }
    setLoading(false);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    const { error } = await supabase
      .from('settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', settingsId);

    if (!error) {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl relative">

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl font-medium z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Save Settings"
          message="Are you sure you want to save these settings?"
          confirmLabel="Save"
          variant="primary"
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Global Settings
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage business information and website configuration.
          </p>
        </div>
        <Button onClick={() => setShowConfirmModal(true)} disabled={saving}>
          <SaveIcon className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Business Info */}
      <Card>
        <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Instagram Handle</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Bank Name</label>
              <input
                type="text"
                value={settings.bank_name}
                onChange={(e) => handleChange('bank_name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Account Name</label>
              <input
                type="text"
                value={settings.account_name}
                onChange={(e) => handleChange('account_name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">IBAN</label>
              <input
                type="text"
                value={settings.iban}
                onChange={(e) => handleChange('iban', e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Website Settings */}
      <Card>
        <CardHeader><CardTitle>Website Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50">
            <div>
              <h4 className="font-medium text-slate-200">Enable Online Bookings</h4>
              <p className="text-sm text-slate-400">
                Allow customers to submit booking requests.
              </p>
            </div>
            <button
              onClick={() => handleChange('enable_bookings', !settings.enable_bookings)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                settings.enable_bookings ? 'bg-brand-blue' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.enable_bookings ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50">
            <div>
              <h4 className="font-medium text-slate-200">Enable WhatsApp Button</h4>
              <p className="text-sm text-slate-400">
                Show quick chat button on all public pages.
              </p>
            </div>
            <button
              onClick={() => handleChange('enable_whatsapp', !settings.enable_whatsapp)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                settings.enable_whatsapp ? 'bg-brand-blue' : 'bg-slate-600'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.enable_whatsapp ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-4">
          <HardDriveIcon className="w-5 h-5 text-brand-blue" />
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <StorageUsage />
        </CardContent>
      </Card>

    </div>
  );
}