import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { LockIcon } from 'lucide-react';
export function PrivacyPage() {
  const policies = [
  {
    title: 'Information We Collect',
    content:
    'When you book with Jump N Slide 4 Kids, we collect personal information necessary to fulfill your request. This includes your full name, phone number (WhatsApp), email address, and the exact event location (Emirate, area, and full address). We also collect basic, anonymized website usage data to help us improve our online experience.'
  },
  {
    title: 'How We Use Your Information',
    content:
    'The information we collect is used strictly for service delivery and communication. This includes processing your booking, sending confirmation and reminder emails, coordinating delivery logistics, and managing post-event feedback. We do not use your personal phone number or email for spam marketing.'
  },
  {
    title: 'Information Sharing',
    content:
    'We respect your privacy and will never sell, rent, or trade your personal data to third parties. We only share necessary details (like your address and phone number) with our trusted delivery and service staff to ensure they can reach your location and set up your event successfully.'
  },
  {
    title: 'Data Security',
    content:
    'We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.'
  },
  {
    title: 'Cookies',
    content:
    'Our website uses basic cookies to ensure core functionality, such as remembering your package selections while you navigate through the booking process. You can instruct your browser to refuse all cookies, but this may limit your ability to use certain features of our site.'
  },
  {
    title: 'Your Rights',
    content:
    'You have the right to request access to the personal data we hold about you, ask for corrections to inaccurate information, or request the deletion of your data after your event is completed. To exercise these rights, please contact us via email.'
  },
  {
    title: "Children's Privacy",
    content:
    'Our services are designed for children, but our website and booking process are intended strictly for adults (parents or legal guardians). We do not knowingly collect personal information directly from children under the age of 18.'
  },
  {
    title: 'Contact for Privacy Inquiries',
    content:
    'If you have any questions or concerns regarding this Privacy Policy or how we handle your data, please contact us at jumpnslide4kids@gmail.com or via WhatsApp at +971 50 647 7052.'
  },
  {
    title: 'Changes to This Policy',
    content:
    'We may update our Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date.'
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
          
          <LockIcon className="w-12 h-12 text-brand-blue mx-auto mb-6" />
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            How we collect, use, and protect your personal information.
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
            {policies.map((policy, idx) =>
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
                  {policy.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {policy.content}
                </p>
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