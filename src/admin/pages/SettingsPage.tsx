import React, { useState, useEffect } from 'react';
import { SaveIcon, Loader2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
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
  const [settingsId, setSettingsId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

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
        <div className="fixed top-20 right-8 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl font-medium z-50 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">Global Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Manage business information and website configuration.</p>
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
              <p className="text-sm text-slate-400">Allow customers to submit booking requests.</p>
            </div>
            <button
              onClick={() => handleChange('enable_bookings', !settings.enable_bookings)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.enable_bookings ? 'bg-brand-blue' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.enable_bookings ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50">
            <div>
              <h4 className="font-medium text-slate-200">Enable WhatsApp Button</h4>
              <p className="text-sm text-slate-400">Show quick chat button on all public pages.</p>
            </div>
            <button
              onClick={() => handleChange('enable_whatsapp', !settings.enable_whatsapp)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.enable_whatsapp ? 'bg-brand-blue' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.enable_whatsapp ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}