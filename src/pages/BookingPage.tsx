import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PACKAGES } from '../data';
import { CheckCircle2Icon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pkg = PACKAGES.find((p) => p.slug === slug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    customStart: '14:00',
    customEnd: '18:00',
    timeConfirmed: false,
    name: '',
    phone: '+971 ',
    email: '',
    emirate: 'Ras Al Khaimah',
    area: '',
    address: '',
    requests: ''
  });

  // Save to sessionStorage on every change
  useEffect(() => {
    if (!slug) return;
    sessionStorage.setItem(`booking_${slug}`, JSON.stringify({ formData, step }));
  }, [formData, step, slug]);

  // Restore from sessionStorage on mount
  useEffect(() => {
    if (!slug) return;
    const saved = sessionStorage.getItem(`booking_${slug}`);
    if (saved) {
      const { formData: savedForm, step: savedStep } = JSON.parse(saved);
      setFormData(savedForm);
      setStep(savedStep);
    }
  }, [slug]);

  if (!pkg) return <div>Package not found</div>;

  const today = new Date().toISOString().split('T')[0];


 const emirates = [
  'Ras Al Khaimah', 'Dubai', 'Sharjah', 'Ajman',
  'Umm Al Quwain', 'Abu Dhabi', 'Fujairah', 'Al Ain'
];

const deliveryCharges: Record<string, number> = {
  'Ras Al Khaimah': 70,
  'Dubai': 150,
  'Sharjah': 150,
  'Ajman': 120,
  'Umm Al Quwain': 100,
  'Abu Dhabi': 180,
  'Fujairah': 150,
  'Al Ain': 180,
};

  const deliveryFee = deliveryCharges[formData.emirate] || 0;
  const total = pkg.price + deliveryFee;
  const advance = Math.ceil(total / 2);

  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM' },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 4:00 PM' },
    { id: 'evening', label: 'Evening', time: '4:00 PM - 8:00 PM' },
    { id: 'custom', label: 'Custom Time', time: 'Choose your hours' }
  ];

  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return [`${h}:00`, `${h}:30`];
  }).flat();

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    let duration = endHour + endMin / 60 - (startHour + startMin / 60);
    if (duration < 0) duration += 24;
    return duration;
  };

  const duration = calculateDuration(formData.customStart, formData.customEnd);
  const isDurationValid = duration > 0 && duration <= 6;

  const getSelectedTimeText = () => {
    if (!formData.timeSlot) return '';
    if (formData.timeSlot !== 'custom') {
      return timeSlots.find((s) => s.id === formData.timeSlot)?.time || '';
    }
    const format12h = (time24: string) => {
      const [h, m] = time24.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
    };
    return `${format12h(formData.customStart)} to ${format12h(formData.customEnd)}`;
  };

  const isStep1Valid =
    formData.date &&
    formData.timeSlot &&
    formData.timeConfirmed &&
    (formData.timeSlot !== 'custom' || isDurationValid);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (step === 1) {
    if (!isStep1Valid) return;
    setStep(2);
    return;
  }

  // Step 2 submit — save to Supabase first
  setIsSubmitting(true);
  setSubmitError('');

  try {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
    const ref = `JNS-${dateStr}-${suffix}`;

    const { error } = await supabase.from('bookings').insert({
      booking_ref: ref,
      status: 'Pending Payment',
      package_name: pkg.name,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      event_date: formData.date,
      event_time: getSelectedTimeText(),
      emirate: formData.emirate,
      area: formData.area,
      address: formData.address,
      special_requests: formData.requests || null,
      total_amount: Number(total),
      advance_amount: Number(advance),
      delivery_fee: Number(deliveryFee),
    });

    if (error) throw error;

    // Navigate to payment page
    navigate(`/payment/${ref}`, {
      state: {
        packageName: pkg.name,
        totalAmount: total,
        advanceAmount: advance,
        deliveryFee: deliveryFee,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        eventDate: formData.date,
        eventTime: getSelectedTimeText(),
        emirate: formData.emirate,
        area: formData.area,
        address: formData.address,
        specialRequests: formData.requests,
      }
    });

  } catch (error) {
    console.error('Error saving booking:', error);
    setSubmitError('Something went wrong. Please try again or WhatsApp us at +971 50 647 7052.');
    setIsSubmitting(false);
  }
};

  const stepLabel = ['Date & Time', 'Your Details', 'Payment'];

  return (
    <main className="pt-20 bg-gray-50 min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                <span className="text-xs mt-1 text-gray-500">{stepLabel[i]}</span>
              </div>
              {i < 2 && (
                <div className={`w-16 h-1 mb-4 ${step > s ? 'bg-brand-blue' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 bg-brand-navy text-white">
            <h1 className="font-heading font-bold text-2xl">Complete Your Booking</h1>
            <p className="text-gray-300">{pkg.name} Package</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                    <h2 className="font-bold text-xl text-brand-navy mb-4">Select Date</h2>
                    <input
                      type="date"
                      required
                      min={today}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-lg"
                    />
                  </div>

                <div>
                  <h2 className="font-bold text-xl text-brand-navy mb-4">Select Time Slot</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() => setFormData({ ...formData, timeSlot: slot.id, timeConfirmed: false })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.timeSlot === slot.id ? 'border-brand-blue bg-blue-50' : 'border-gray-200 hover:border-brand-blue/50'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-brand-navy">{slot.label}</span>
                          {formData.timeSlot === slot.id && <CheckCircle2Icon className="w-5 h-5 text-brand-blue" />}
                        </div>
                        <span className="text-sm text-gray-600">{slot.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.timeSlot === 'custom' && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-brand-navy mb-4">Custom Time Selection</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <select
                          value={formData.customStart}
                          onChange={(e) => setFormData({ ...formData, customStart: e.target.value, timeConfirmed: false })}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue bg-white"
                        >
                          {hours.map((h) => <option key={`start-${h}`} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time (Max 6 hrs)</label>
                        <select
                          value={formData.customEnd}
                          onChange={(e) => setFormData({ ...formData, customEnd: e.target.value, timeConfirmed: false })}
                          className={`w-full p-3 border rounded-xl focus:ring-2 bg-white ${!isDurationValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue'}`}
                        >
                          {hours.map((h) => <option key={`end-${h}`} value={h}>{h}</option>)}
                        </select>
                      </div>
                    </div>
                    {!isDurationValid && (
                      <p className="text-red-500 text-sm mt-2">
                        {duration === 0
                          ? 'Start and end time cannot be the same.'
                          : `Maximum duration is 6 hours (selected: ${duration.toFixed(1)}h).`}
                      </p>
                    )}
                  </div>
                )}

                {formData.timeSlot && (formData.timeSlot !== 'custom' || isDurationValid) && (
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                    <p className="text-brand-navy font-medium mb-3">
                      You selected: <span className="font-bold text-brand-blue">{getSelectedTimeText()}</span>
                    </p>
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.timeConfirmed}
                        onChange={(e) => setFormData({ ...formData, timeConfirmed: e.target.checked })}
                        className="mt-1 w-5 h-5 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        I confirm that my event will take place during these exact hours. I understand that our team will arrive prior to the start time for setup.
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isStep1Valid}
                  className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold mt-8 hover:bg-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Contact Details
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-bold text-xl text-brand-navy border-b pb-2">Your Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      required type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                  <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                        <input
                          required
                          type="tel"
                          inputMode="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            // Strip spaces automatically
                            const cleaned = e.target.value.replace(/\s+/g, '');
                            setFormData({ ...formData, phone: cleaned });
                          }}
                          placeholder="+971501234567"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">Enter UAE number e.g. +971501234567</p>
                      </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    required type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emirate</label>
                    <select
                      value={formData.emirate}
                      onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-brand-blue outline-none"
                    >
                      {emirates.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area / Neighborhood</label>
                    <input
                      required type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address / Villa Number</label>
                  <textarea
                    required rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.requests}
                    onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none"
                    placeholder="Any special setup instructions or requests..."
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-brand-navy mb-4">Final Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Package Base</span><span>AED {pkg.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery ({formData.emirate})</span><span>AED {deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-brand-navy text-lg pt-2 border-t mt-2">
                      <span>Total</span><span>AED {total}</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 text-brand-blue p-3 rounded-lg font-medium flex justify-between">
                    <span>Advance Required (50%)</span>
                    <span>AED {advance}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50"
                  >
                    Back
                  </button>
                 <>
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                        {submitError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-gradient-brand text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Confirm & Proceed to Payment'}
                    </button>
                  </>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </main>
  );
}