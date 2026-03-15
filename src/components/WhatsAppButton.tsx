import React from 'react';
import { PhoneIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface WhatsAppButtonProps {
  contextMessage?: string;
}
export function WhatsAppButton({
  contextMessage = 'Hi! I am interested in your party rental services.'
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(contextMessage);
  const whatsappUrl = `https://wa.me/971506477052?text=${encodedMessage}`;
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20BA5A] transition-colors group"
      initial={{
        scale: 0
      }}
      animate={{
        scale: 1
      }}
      whileHover={{
        scale: 1.1
      }}
      whileTap={{
        scale: 0.9
      }}>
      
      <motion.div
        animate={{
          boxShadow: [
          '0 0 0 0 rgba(37, 211, 102, 0.7)',
          '0 0 0 15px rgba(37, 211, 102, 0)']

        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
        className="absolute inset-0 rounded-full" />
      
      <PhoneIcon className="w-7 h-7 relative z-10" />

      {/* Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-navy text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-brand-navy" />
      </div>
    </motion.a>);

}