import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  UploadCloudIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  LandmarkIcon } from
'lucide-react';
export function PaymentPage() {
  const { ref } = useParams<{
    ref: string;
  }>();
  const [status, setStatus] = useState<
    'pending' | 'uploaded' | 'later' | 'card_success'>(
    'pending');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card'>(
    'transfer'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const handleCardPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStatus('card_success');
    }, 2000);
  };
  if (status === 'card_success') {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you. Your payment for booking{' '}
            <span className="font-bold">{ref}</span> has been processed
            successfully. We have sent a confirmation email to you.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-brand-navy text-white rounded-xl font-medium">
            
            Return to Home
          </Link>
        </div>
      </main>);

  }
  if (status === 'uploaded') {
    return (
      <main className="pt-32 pb-24 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">
            Receipt Uploaded!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you. Our team is verifying your payment for booking{' '}
            <span className="font-bold">{ref}</span>. We will send a
            confirmation email shortly.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-brand-navy text-white rounded-xl font-medium">
            
            Return to Home
          </Link>
        </div>
      </main>);

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
            Your date is reserved for booking{' '}
            <span className="font-bold">{ref}</span>. Please note that this
            reservation will expire in{' '}
            <span className="font-bold text-red-500">24 hours</span> if payment
            is not received.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            We've sent an email with the payment link.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-brand-navy text-white rounded-xl font-medium">
            
            Return to Home
          </Link>
        </div>
      </main>);

  }
  return (
    <main className="pt-24 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">
            Secure Your Booking
          </h1>
          <p className="text-gray-600">
            Booking Reference:{' '}
            <span className="font-bold text-brand-blue">{ref}</span>
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setPaymentMethod('transfer')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'transfer' ? 'border-brand-blue bg-blue-50/50' : 'border-gray-200 bg-white hover:border-brand-blue/50'}`}>
            
            <LandmarkIcon
              className={`w-8 h-8 mb-2 ${paymentMethod === 'transfer' ? 'text-brand-blue' : 'text-gray-400'}`} />
            
            <span
              className={`font-bold ${paymentMethod === 'transfer' ? 'text-brand-navy' : 'text-gray-600'}`}>
              
              Bank Transfer
            </span>
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === 'card' ? 'border-brand-blue bg-blue-50/50' : 'border-gray-200 bg-white hover:border-brand-blue/50'}`}>
            
            <CreditCardIcon
              className={`w-8 h-8 mb-2 ${paymentMethod === 'card' ? 'text-brand-blue' : 'text-gray-400'}`} />
            
            <span
              className={`font-bold ${paymentMethod === 'card' ? 'text-brand-navy' : 'text-gray-600'}`}>
              
              Credit Card
            </span>
          </button>
        </div>

        {paymentMethod === 'transfer' ?
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="p-6 bg-blue-50 border-b border-blue-100">
                <h2 className="font-bold text-brand-navy">
                  Bank Transfer Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Please transfer the 50% advance amount to the following
                  account:
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Bank Name</span>
                  <span className="col-span-2 font-medium text-brand-navy">
                    Emirates NBD
                  </span>
                </div>
                <div className="grid grid-cols-3 border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Account Name</span>
                  <span className="col-span-2 font-medium text-brand-navy">
                    Jump N Slide 4 Kids
                  </span>
                </div>
                <div className="grid grid-cols-3 pb-2">
                  <span className="text-gray-500">IBAN</span>
                  <span className="col-span-2 font-medium text-brand-navy tracking-wider">
                    AE12 3456 7890 1234 5678 90
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8">
              <h2 className="font-bold text-brand-navy mb-4">
                Upload Transfer Receipt
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-6">
                <UploadCloudIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG or PDF (Max 5MB)
                </p>
              </div>
              <button
              onClick={() => setStatus('uploaded')}
              className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-blue transition-colors">
              
                Submit Receipt
              </button>
            </div>
          </> :

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="font-bold text-brand-navy mb-6">
              Credit Card Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
                
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                type="text"
                placeholder="Name on card"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none" />
              
              </div>
              <button
              onClick={handleCardPayment}
              disabled={isProcessing}
              className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold mt-4 hover:bg-brand-blue transition-colors disabled:opacity-50">
              
                {isProcessing ? 'Processing...' : 'Pay Securely'}
              </button>
            </div>
          </div>
        }

        <div className="text-center">
          <p className="text-gray-500 mb-4">Need more time?</p>
          <button
            onClick={() => setStatus('later')}
            className="text-brand-blue font-medium hover:underline">
            
            Pay Later (Reserves date for 24 hours)
          </button>
        </div>
      </div>
    </main>);

}