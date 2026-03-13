import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PACKAGES } from '../data';
export function BookingPage() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const pkg = PACKAGES.find((p) => p.slug === slug);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '16:00',
    endTime: '20:00',
    name: '',
    phone: '+971 ',
    email: '',
    emirate: 'Ras Al Khaimah',
    area: '',
    address: '',
    requests: ''
  });
  if (!pkg) return <div>Package not found</div>;
  const emirates = [
  'Ras Al Khaimah',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Abu Dhabi',
  'Fujairah'];

  // Mock delivery charges
  const deliveryCharges: Record<string, number> = {
    'Ras Al Khaimah': 50,
    Dubai: 150,
    Sharjah: 100,
    Ajman: 100,
    'Umm Al Quwain': 80,
    'Abu Dhabi': 250,
    Fujairah: 200
  };
  const deliveryFee = deliveryCharges[formData.emirate] || 0;
  const total = pkg.price + deliveryFee;
  const advance = Math.ceil(total / 2);
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    let duration = endHour + endMin / 60 - (startHour + startMin / 60);
    if (duration < 0) duration += 24; // Handle crossing midnight
    return duration;
  };
  const duration = calculateDuration(formData.startTime, formData.endTime);
  const isDurationValid = duration > 0 && duration <= 6;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!isDurationValid) {
        alert('Event duration must be between 1 and 6 hours.');
        return;
      }
      setStep(2);
    } else {
      // Generate mock reference
      const ref = `#JNS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        Math.random() * 1000
      ).
      toString().
      padStart(3, '0')}`;
      navigate(`/payment/${ref}`);
    }
  };
  return (
    <main className="pt-20 bg-gray-50 min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center mb-12">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
            
            1
          </div>
          <div
            className={`w-16 h-1 ${step >= 2 ? 'bg-brand-blue' : 'bg-gray-200'}`} />
          
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
            
            2
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 bg-brand-navy text-white">
            <h1 className="font-heading font-bold text-2xl">
              Complete Your Booking
            </h1>
            <p className="text-gray-300">{pkg.name} Package</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {step === 1 ?
            <div className="space-y-6">
                <h2 className="font-bold text-xl text-brand-navy border-b pb-2">
                  When is the party?
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value
                    })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none" />
                  
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        startTime: e.target.value
                      })
                      }
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time (Max 6 hrs)
                      </label>
                      <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) =>
                      setFormData({
                        ...formData,
                        endTime: e.target.value
                      })
                      }
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none ${!isDurationValid && formData.endTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-brand-blue focus:border-brand-blue'}`} />
                    
                    </div>
                  </div>
                  {!isDurationValid && formData.endTime &&
                <p className="text-red-500 text-sm mt-1">
                      Duration is {duration.toFixed(1)} hours. Maximum allowed
                      is 6 hours.
                    </p>
                }
                  {isDurationValid &&
                <p className="text-green-600 text-sm mt-1">
                      Duration: {duration.toFixed(1)} hours
                    </p>
                }
                </div>
                <button
                type="submit"
                disabled={!isDurationValid}
                className="w-full py-4 bg-brand-navy text-white rounded-xl font-bold mt-8 hover:bg-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                
                  Next: Contact Details
                </button>
              </div> :

            <div className="space-y-6">
                <h2 className="font-bold text-xl text-brand-navy border-b pb-2">
                  Your Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value
                    })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl" />
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value
                    })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl" />
                
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emirate
                    </label>
                    <select
                    value={formData.emirate}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      emirate: e.target.value
                    })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white">
                    
                      {emirates.map((e) =>
                    <option key={e} value={e}>
                          {e}
                        </option>
                    )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area / Neighborhood
                    </label>
                    <input
                    required
                    type="text"
                    value={formData.area}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: e.target.value
                    })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address / Villa Number
                  </label>
                  <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value
                  })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl" />
                
                </div>

                {/* Final Summary inside form */}
                <div className="bg-gray-50 p-6 rounded-xl mt-8">
                  <h3 className="font-bold text-brand-navy mb-4">
                    Final Summary
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Package Base</span>
                      <span>AED {pkg.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery ({formData.emirate})</span>
                      <span>AED {deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-brand-navy text-lg pt-2 border-t mt-2">
                      <span>Total</span>
                      <span>AED {total}</span>
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
                  className="px-6 py-4 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50">
                  
                    Back
                  </button>
                  <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-brand text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                  
                    Confirm & Proceed to Payment
                  </button>
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    </main>);

}