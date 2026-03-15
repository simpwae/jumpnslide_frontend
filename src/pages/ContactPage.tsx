import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  InstagramIcon,
  FacebookIcon,
  MusicIcon,
  SendIcon,
  MessageCircleIcon } from 'lucide-react';
export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };
  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-24">
      {/* Hero */}
      <div className="bg-brand-navy py-20 px-4 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}>
          
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a question about our packages or need a custom setup? We're
            here to help make your party perfect.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Cards */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.1
              }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              
              <h3 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                Contact Details
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">
                      WhatsApp / Phone
                    </p>
                    <p className="text-gray-600 text-lg">+971 50 647 7052</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center shrink-0 mr-4">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">Email</p>
                    <p className="text-gray-600 text-lg">
                      jumpnslide4kids@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-100 text-brand-pink rounded-full flex items-center justify-center shrink-0 mr-4">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">Location</p>
                    <p className="text-gray-600 text-lg">
                      Based in Ras Al Khaimah
                    </p>
                    <p className="text-sm text-gray-500">
                      Serving all 7 UAE Emirates
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.2
              }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              
              <div className="flex items-center mb-6">
                <ClockIcon className="w-6 h-6 text-brand-navy mr-3" />
                <h3 className="font-heading font-bold text-2xl text-brand-navy">
                  Operating Hours
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium">Phone Calls</span>
                  <span>9:00 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="font-medium">WhatsApp</span>
                  <span>9:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between pt-1">
                  <span className="font-medium">Email Support</span>
                  <span>24/7 (Reply within 24hrs)</span>
                </li>
              </ul>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.3
              }}
              className="bg-brand-navy p-8 rounded-2xl shadow-sm text-white text-center">
              
              <h3 className="font-heading font-bold text-xl mb-6">
                Follow Our Parties
              </h3>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://www.instagram.com/jumpnslide4kids"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-pink transition-colors">
                  
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://www.facebook.com/jumpnslide4kids"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                  
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@jumpnslide4kids"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  
                  <MusicIcon className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{
                opacity: 0,
                y: 30
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2
              }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 h-full">
              
              <div className="mb-8">
                <h2 className="font-heading font-bold text-3xl text-brand-navy mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-500">
                  Fill out the form below and our team will get back to you
                  shortly.
                </p>
              </div>

              {isSuccess ?
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                className="bg-green-50 border border-green-200 rounded-xl p-8 text-center h-64 flex flex-col items-center justify-center">
                
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <SendIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-xl text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-600">
                    Thank you for reaching out. We'll be in touch soon.
                  </p>
                </motion.div> :

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                      required
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                      placeholder="John Doe" />
                    
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                      required
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                      placeholder="+971 50 000 0000" />
                    
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                    required
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                    placeholder="john@example.com" />
                  
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all bg-white">
                    
                      <option value="">Select a subject...</option>
                      <option value="general">General Inquiry</option>
                      <option value="package">Package Question</option>
                      <option value="custom">Custom Setup Request</option>
                      <option value="booking">Existing Booking Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                    required
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all resize-none"
                    placeholder="How can we help you?">
                  </textarea>
                  </div>

                  <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-brand text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-70">
                  
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              }

              {/* WhatsApp Callout */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="bg-green-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between border border-green-100">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <MessageCircleIcon className="w-8 h-8 text-green-500 mr-4 shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800">
                        Prefer WhatsApp?
                      </h4>
                      <p className="text-sm text-green-600">
                        Get a faster response by chatting with us directly.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/971506477052?text=Hi!%20I%20have%20a%20question%20about%20your%20party%20rentals."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors whitespace-nowrap">
                    
                    Chat Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>);

}