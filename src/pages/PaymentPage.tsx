import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, LandmarkIcon, CopyIcon, BanknoteIcon } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';

const EMAILJS_SERVICE_ID = 'service_wdhb3u5';
const EMAILJS_OWNER_TEMPLATE = 'template_p9pinem';
const EMAILJS_PUBLIC_KEY = 'hF4zI9NwINt2gOzUa';

export function PaymentPage() {
  const { ref } = useParams<{ ref: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(location.state || null);
  const [hasTransferred, setHasTransferred] = useState(false);
  const [status, setStatus] = useState<'pending' | 'submitted'>('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [formData, setFormData] = useState({
    bank: '',
    accountHolder: '',
    transferRef: '',
  });

  // Fetch booking from Supabase if page is refreshed (state lost)
  useEffect(() => {
    if (!booking && ref) {
      setLoadingBooking(true);
      supabase
        .from('bookings')
        .select('*')
        .eq('booking_ref', ref)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setBooking({
              packageName: data.package_name,
              totalAmount: data.total_amount,
              advanceAmount: data.advance_amount,
              deliveryFee: data.delivery_fee,
              customerName: data.customer_name,
              customerPhone: data.customer_phone,
              customerEmail: data.customer_email,
              eventDate: data.event_date,
              eventTime: data.event_time,
              emirate: data.emirate,
              area: data.area,
              address: data.address,
            });
          }
          if (error) {
            console.error('Could not fetch booking:', error);
          }
          setLoadingBooking(false);
        });
    }
  }, [ref, booking]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // iOS Safari fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const submissionTime = new Date().toLocaleString('en-AE', {
      timeZone: 'Asia/Dubai'
    });

    const templateParams = {
      booking_ref: ref,
      customer_name: booking?.customerName || 'N/A',
      customer_phone: booking?.customerPhone || 'N/A',
      customer_email: booking?.customerEmail || 'N/A',
      package_name: booking?.packageName || 'N/A',
      event_date: booking?.eventDate || 'N/A',
      event_time: booking?.eventTime || 'N/A',
      emirate: booking?.emirate || 'N/A',
      address: booking?.address || 'N/A',
      bank_name: formData.bank,
      account_holder: formData.accountHolder,
      amount: `AED ${booking?.advanceAmount}`,
      transfer_date: submissionTime,
      transfer_ref: formData.transferRef || 'Not provided',
    };

    try {
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'Payment Uploaded',
          bank_name: formData.bank,
          account_holder: formData.accountHolder,
          transfer_ref: formData.transferRef || null,
          transfer_date: new Date().toISOString(),
          transfer_amount: `AED ${booking?.advanceAmount}`,
        })
        .eq('booking_ref', ref);

      if (error) throw error;

      // Show success immediately
      sessionStorage.clear();
      setStatus('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Send email separately — non-critical
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_OWNER_TEMPLATE,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit. Please WhatsApp us at +971 50 647 7052.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Success screen
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
            Booking Reference:{' '}
            <span className="font-bold text-brand-blue">{ref}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Our team will review your transfer and contact you shortly to confirm your booking.
          </p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="inline-block px-6 py-3 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-blue transition-colors"
          >
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  if (loadingBooking) {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading your booking...</p>
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
          <p className="text-gray-500 text-sm">
            Booking Reference:{' '}
            <span className="font-bold text-brand-blue">{ref}</span>
          </p>
        </div>

        {/* Booking Summary */}
        {booking && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
            <h2 className="font-bold text-brand-navy mb-3">Booking Summary</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Package</span>
              <span className="font-medium text-gray-800">{booking.packageName}</span>
              <span className="text-gray-500">Event Date</span>
              <span className="font-medium text-gray-800">{booking.eventDate}</span>
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-800">{booking.eventTime}</span>
              <span className="text-gray-500">Emirate</span>
              <span className="font-medium text-gray-800">{booking.emirate}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-gray-700">AED {booking.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-brand-navy">Advance Required (50%)</span>
                <span className="font-bold text-2xl text-brand-blue">
                  AED {booking.advanceAmount}
                </span>
              </div>
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
                <span className="font-medium text-brand-navy tracking-wider">
                  AE12 3456 7890 1234 5678 90
                </span>
                <button
                  onClick={() => handleCopy('AE12345678901234567890')}
                  className="text-brand-blue hover:text-blue-700"
                  title="Copy IBAN"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-green-500 text-xs text-right">Copied!</p>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-brand-navy">Amount to Transfer</span>
              <span className="font-bold text-brand-blue text-xl">
                AED {booking?.advanceAmount || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* State 1 — Before Transfer */}
        {!hasTransferred ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BanknoteIcon className="w-8 h-8 text-brand-blue" />
            </div>
            <h2 className="font-bold text-xl text-brand-navy mb-2">
              Ready to Transfer?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Please transfer <span className="font-bold text-brand-blue">AED {booking?.advanceAmount}</span> to the account above using your banking app, then come back and confirm below.
            </p>
            <button
              onClick={() => setHasTransferred(true)}
              className="w-full py-4 bg-gradient-brand text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              ✓ I Have Transferred the Payment
            </button>
            <p className="text-xs text-gray-400 mt-3">
              Only click this after completing your bank transfer
            </p>
          </div>
        ) : (

          /* State 2 — After Transfer — Confirmation Form */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              <h2 className="font-bold text-brand-navy">
                Great! Now confirm your transfer details
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Fill in your bank details so we can verify your payment quickly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank You Transferred From
                </label>
                <select
                  required
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-blue outline-none"
                >
                  <option value="">Select your bank...</option>
                  <option>Emirates NBD</option>
                  <option>ADCB</option>
                  <option>Dubai Islamic Bank</option>
                  <option>Mashreq</option>
                  <option>First Abu Dhabi Bank (FAB)</option>
                  <option>RAK Bank</option>
                  <option>Abu Dhabi Islamic Bank (ADIB)</option>
                  <option>Commercial Bank of Dubai</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Name on your bank account"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Reference{' '}
                  <span className="text-gray-400 font-normal">(Optional but recommended)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRN123456789"
                  value={formData.transferRef}
                  onChange={(e) => setFormData({ ...formData, transferRef: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Find this in your bank app after transferring. Helps us verify faster.
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-brand text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 pb-safe"
              >
                {isProcessing ? 'Submitting...' : 'Submit & Confirm Booking'}
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}