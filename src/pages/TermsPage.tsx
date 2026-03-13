import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from 'lucide-react';
export function TermsPage() {
  const terms = [
  {
    title: '1. Reservation & Payment',
    content:
    'A 50% advance payment is required to confirm any booking. The remaining balance must be paid before setup begins on the event day. Setup will only commence once full payment has been received and verified by our team.'
  },
  {
    title: '2. Cancellation Policy',
    content:
    'All bookings are final. The 50% advance payment is strictly non-refundable under any circumstances, as it secures your date and prevents us from accepting other bookings for that equipment.'
  },
  {
    title: '3. Adult Supervision',
    content:
    'Mandatory adult supervision is required at all times while the equipment is in use. Our staff is there to operate machines and ensure general safety, but parents/guardians are ultimately responsible for the children.'
  },
  {
    title: '4. Usage Rules',
    content:
    'Strictly NO food, drinks, chewing gum, pets, shoes, or sharp objects are allowed on or near the inflatables. The equipment is designed for children only. Rough play, wall climbing, and exceeding the maximum capacity are prohibited. The client is fully responsible for any damage caused by violating these rules.'
  },
  {
    title: '5. Safety & Staff',
    content:
    'Our staff reserves the right to pause or terminate activities if they observe unsafe behavior. We provide both male and female staff upon request. Any inappropriate behavior towards our staff will result in immediate termination of the service without a refund.'
  },
  {
    title: '6. Setup Requirements',
    content:
    'The client must provide adequate space, clear access to the setup area, and a reliable electricity source within 20 meters. Any delays caused by the client (e.g., area not cleared, no power) will eat into your rental time and will not extend the service duration.'
  },
  {
    title: '7. Weather & Unforeseen Events',
    content:
    'For outdoor setups, we reserve the right to pause or cancel services due to severe weather conditions (rain, high winds, extreme heat) or force majeure. In such cases, rescheduling will be offered at the discretion of Jump N Slide 4 Kids management.'
  },
  {
    title: '8. Liability',
    content:
    'The client is fully responsible for any damage, loss, or theft of equipment during the rental period. Jump N Slide 4 Kids is not liable for any injuries, accidents, or damages resulting from the misuse of equipment or lack of proper adult supervision.'
  },
  {
    title: '9. Promotional Use',
    content:
    'We may take photos or videos of the setup and event atmosphere for marketing purposes on our website and social media. If you prefer not to have your event photographed, please provide an opt-out request in writing prior to the event date.'
  },
  {
    title: '10. Booking Modifications',
    content:
    'Changes to your booking (date, time, or package) are allowed a minimum of 3 days before the event, strictly subject to availability. Requests must be made via WhatsApp or email. No changes or modifications are permitted within 72 hours of the event.'
  }];

  return (
    <main className="pt-20 min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-brand-navy py-16 px-4 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="max-w-3xl mx-auto">
          
          <ShieldCheckIcon className="w-12 h-12 text-brand-pink mx-auto mb-6" />
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-lg">
            Please read these terms carefully before booking your event.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2
          }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <div className="space-y-10">
            {terms.map((term, idx) =>
            <motion.section
              key={idx}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-50px'
              }}
              transition={{
                delay: idx * 0.05
              }}>
              
                <h2 className="font-heading font-bold text-xl text-brand-navy mb-3">
                  {term.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{term.content}</p>
              </motion.section>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-400 text-center">
            Last Updated: March 2026
          </div>
        </motion.div>
      </div>
    </main>);

}