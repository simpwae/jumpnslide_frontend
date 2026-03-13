import React, { useState } from 'react';
import { SaveIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function SettingsPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };
  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };
  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Success Toast */}
      {showSuccessToast &&
      <div className="fixed top-20 right-8 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl font-medium z-50 animate-fade-in flex items-center">
          <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7" />
          
          </svg>
          Settings saved successfully
        </div>
      }

      {/* Confirmation Modal */}
      {showConfirmModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-heading font-bold text-slate-100 mb-2">
              Confirm Changes
            </h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to save these settings? This will update
              your public website immediately.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}>
              
                Cancel
              </Button>
              <Button onClick={handleConfirmSave}>Confirm Save</Button>
            </div>
          </div>
        </div>
      }

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Global Settings
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage business information and website configuration.
          </p>
        </div>
        <Button onClick={handleSaveClick}>
          <SaveIcon className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Business Name
              </label>
              <input
                type="text"
                defaultValue="Jump N Slide 4 Kids"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                defaultValue="+971 50 647 7052"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="jumpnslide4kids@gmail.com"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Instagram Handle
              </label>
              <input
                type="text"
                defaultValue="@jumpnslide4kids"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50">
              <div>
                <h4 className="font-medium text-slate-200">
                  Enable Online Bookings
                </h4>
                <p className="text-sm text-slate-400">
                  Allow customers to submit booking requests via the website.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle1"
                  defaultChecked
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-brand-blue appearance-none cursor-pointer translate-x-6 transition-transform" />
                
                <label
                  htmlFor="toggle1"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-brand-blue cursor-pointer">
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50">
              <div>
                <h4 className="font-medium text-slate-200">
                  Enable WhatsApp Floating Button
                </h4>
                <p className="text-sm text-slate-400">
                  Show the quick chat button on all public pages.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle2"
                  defaultChecked
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-brand-blue appearance-none cursor-pointer translate-x-6 transition-transform" />
                
                <label
                  htmlFor="toggle2"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-brand-blue cursor-pointer">
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}