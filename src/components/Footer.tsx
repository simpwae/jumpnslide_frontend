import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, PhoneIcon, MailIcon } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column */}
          <div>
            <div className="flex flex-col mb-4">
              <span className="font-heading font-extrabold text-3xl text-white leading-none">
                Jump N Slide
              </span>
              <span className="font-heading font-bold text-sm tracking-widest uppercase text-brand-pink">
                4 Kids
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your Party. Our Setup. Their Smiles. Delivering unforgettable
              party experiences across the UAE.
            </p>
            <div className="inline-block px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-sm font-medium">
              📍 Based in Ajman · Serving all 7 Emirates
            </div>
          </div>

          {/* Center Column */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors">
                  
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="text-gray-400 hover:text-white transition-colors">
                  
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-gray-400 hover:text-white transition-colors">
                  
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors">
                  
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors">
                  
                  Contact
                </Link>
              </li>
              <li>
              <Link
                to="/faq"
                className="text-gray-400 hover:text-white transition-colors">
                FAQs
              </Link>
            </li>
              <li className="pt-4">
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm">
                  
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <PhoneIcon className="w-5 h-5 mr-3 text-brand-pink" />
                <span>+971 50 647 7052</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MailIcon className="w-5 h-5 mr-3 text-brand-pink" />
                <span>jumpnslide4kids@gmail.com</span>
              </li>
            </ul>

            <h3 className="font-heading font-bold text-lg mt-8 mb-4 text-white">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/jumpnslide4kids"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-pink transition-colors">
                
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/jumpnslide4kids"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors">
                
                <FacebookIcon className="w-5 h-5" />
              </a>
              {/* TikTok icon placeholder using a generic icon since lucide doesn't have tiktok */}
              <a
                href="https://www.tiktok.com/@jumpnslide4kids"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors font-bold text-lg">
                
                <span className="leading-none">d</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Jump N Slide 4 Kids. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span className="text-white font-medium cursor-pointer">
              English
            </span>
            <span>|</span>
            <span className="hover:text-white cursor-pointer transition-colors">
              العربية
            </span>
          </div>
        </div>
      </div>
    </footer>);

}