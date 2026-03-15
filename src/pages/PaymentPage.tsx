import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, LandmarkIcon, CopyIcon } from 'lucide-react';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_wdhb3u5';
const EMAILJS_OWNER_TEMPLATE = 'template_p9pinem';
const EMAILJS_CUSTOMER_TEMPLATE = 'template_ydqjnp5';
const EMAILJS_PUBLIC_KEY = 'hF4zI9NwINt2gOzUa';

export function PaymentPage() {
  const { ref } = useParams<{ ref: string }>();
  const location = useLocation();
  const booking = (location.state as any) || {};

  const [status, setStatus] = useState<'pending' | 'submitted' | 'later'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    bank: '',
    accountHolder: '',
    amount: '',
    transferDate: '',
    transferRef: '',
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const templateParams = {
      booking_ref: ref,
      customer_name: booking.customerName || 'N/A',
      customer_phone: booking.customerPhone || 'N/A',
      customer_email: booking.customerEmail || 'N/A',
      package_name: booking.packageName || 'N/A',
      event_date: booking.eventDate || 'N/A',
      event_time: booking.eventTime || 'N/A',
      emirate: booking.emirate || 'N/A',
      address: booking.address || 'N/A',
      bank_name: formData.bank,
      account_holder: formData.accountHolder,
      amount: formData.amount,
      transfer_date: formData.transferDate,
      transfer_ref: formData.transferRef || 'Not provided',
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_OWNER_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY);
      sessionStorage.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setStatus('submitted');
    } catch (error) {
      alert('Failed to send. Please WhatsApp us at +971 50 647 7052.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'submitted') {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">
            Transfer Details Submitted!
          </h1>
          <p className="text-gray-600 mb-2">
            Booking Reference: <span className="font-bold text-brand-blue">{ref}</span>
          </p>
          <p className="text-gray-600 mb-6">
            We will review your transfer and contact you shortly to confirm your booking.
          </p>
          <Link to="/" className="inline-block px-6 py-3 bg-brand-navy text-white rounded-xl font-medium">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  if (status === 'later') {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">
            Date Reserved
          </h1>
          <p className="text-gray-600 mb-6">
            Your booking reference is <span className="font-bold">{ref}</span>. Please complete payment within <span className="font-bold text-red-500">24 hours</span> to confirm your booking.
          </p>
          <Link to="/" className="inline-block px-6 py-3 bg-brand-navy text-white rounded-xl font-medium">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Booking Reference: <span className="font-bold text-brand-blue">{ref}</span>
          </p>
        </div>

        {/* Booking Summary */}
        {booking.packageName && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
            <h2 className="font-bold text-brand-navy mb-3">Booking Summary</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <span className="text-gray-500">Package</span>
              <span className="font-medium">{booking.packageName}</span>
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{booking.eventDate}</span>
              <span className="text-gray-500">Time</span>
              <span className="font-medium">{booking.eventTime}</span>
              <span className="text-gray-500">Emirate</span>
              <span className="font-medium">{booking.emirate}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
              <span className="font-bold text-brand-navy">Advance Required (50%)</span>
              <span className="font-bold text-xl text-brand-blue">AED {booking.advanceAmount}</span>
            </div>
          </div>
        )}

        {/* Bank Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5 bg-blue-50 border-b border-blue-100 flex items-center">
            <LandmarkIcon className="w-5 h-5 text-brand-blue mr-2" />
            <h2 className="font-bold text-brand-navy">Transfer To This Account</h2>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Bank Name</span>
              <span className="font-medium text-brand-navy">Emirates NBD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name</span>
              <span className="font-medium text-brand-navy">Jump N Slide 4 Kids</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">IBAN</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-brand-navy tracking-wider">AE12 3456 7890 1234 5678 90</span>
                <button
                  onClick={() => handleCopy('AE12345678901234567890')}
                  className="text-brand-blue hover:text-blue-700"
                  title="Copy IBAN"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            {copied && <p className="text-green-500 text-xs text-right">Copied!</p>}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-bold text-brand-navy">Amount to Transfer</span>
              <span className="font-bold text-brand-blue text-lg">
                AED {booking.advanceAmount || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-brand-navy mb-5">Confirm Your Transfer</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Used</label>
                <select
                  required
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="">Select Bank...</option>
                  <option>Emirates NBD</option>
                  <option>ADCB</option>
                  <option>Dubai Islamic Bank</option>
                  <option>Mashreq</option>
                  <option>First Abu Dhabi Bank (FAB)</option>
                  <option>RAK Bank</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                <input
                  required
                  type="text"
                  placeholder="Name on your bank account"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Transferred (AED)</label>
                <input
                  required
                  type="number"
                  placeholder={`e.g. ${booking.advanceAmount || '1250'}`}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time of Transfer</label>
                <input
                  required
                  type="datetime-local"
                  value={formData.transferDate}
                  onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Reference <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. TRN123456789"
                value={formData.transferRef}
                onChange={(e) => setFormData({ ...formData, transferRef: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-brand text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {isProcessing ? 'Submitting...' : 'Submit Transfer Details'}
            </button>
          </form>
        </div>

        {/* Pay Later */}
        <div className="text-center">
          <p className="text-gray-500 mb-2">Need more time to transfer?</p>
          <button
            onClick={() => setStatus('later')}
            className="text-brand-blue font-medium hover:underline"
          >
            I'll pay later (reserves your date for 24 hours)
          </button>
        </div>

      </div>
    </main>
  );
}