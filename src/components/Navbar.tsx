import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PACKAGES } from '../data';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPackagesHovered, setIsPackagesHovered] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  const navBg = isHome && !isScrolled ? 'bg-transparent' : 'bg-white shadow-md';
  const textColor = isHome && !isScrolled ? 'text-white' : 'text-brand-navy';
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-gradient';
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col justify-center">
            <motion.div
              initial={{
                y: -20,
                opacity: 0
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}>
              
              <span
                className={`font-heading font-extrabold text-2xl leading-none ${logoColor}`}>
                
                Jump N Slide
              </span>
              <span
                className={`font-heading font-bold text-sm tracking-widest uppercase ${isHome && !isScrolled ? 'text-white/80' : 'text-brand-pink'}`}>
                
                4 Kids
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium hover:opacity-70 transition-opacity ${textColor} ${location.pathname === '/' ? 'border-b-2 border-brand-pink' : ''}`}>
              
              Home
            </Link>

            {/* Packages Dropdown */}
            <div
              className="relative py-8"
              onMouseEnter={() => setIsPackagesHovered(true)}
              onMouseLeave={() => setIsPackagesHovered(false)}>
              
              <Link
                to="/packages"
                className={`font-medium flex items-center hover:opacity-70 transition-opacity ${textColor} ${location.pathname.includes('/packages') ? 'border-b-2 border-brand-pink' : ''}`}>
                
                Packages <ChevronDownIcon className="ml-1 w-4 h-4" />
              </Link>

              <AnimatePresence>
                {isPackagesHovered &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0,
                    y: 10
                  }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100 overflow-hidden">
                  
                    {PACKAGES.map((pkg) =>
                  <Link
                    key={pkg.slug}
                    to={`/packages/${pkg.slug}`}
                    className="block px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-light hover:text-brand-blue transition-colors">
                    
                        {pkg.name}
                      </Link>
                  )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                    to="/packages"
                    className="block px-4 py-2 text-sm font-semibold text-brand-pink hover:bg-brand-light transition-colors">
                    
                      View All Packages →
                    </Link>
                  </motion.div>
                }
              </AnimatePresence>
            </div>

            <Link
              to="/gallery"
              className={`font-medium hover:opacity-70 transition-opacity ${textColor} ${location.pathname === '/gallery' ? 'border-b-2 border-brand-pink' : ''}`}>
              
              Gallery
            </Link>
            <Link
              to="/about"
              className={`font-medium hover:opacity-70 transition-opacity ${textColor} ${location.pathname === '/about' ? 'border-b-2 border-brand-pink' : ''}`}>
              
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium hover:opacity-70 transition-opacity ${textColor} ${location.pathname === '/contact' ? 'border-b-2 border-brand-pink' : ''}`}>
              
              Contact
            </Link>

            <div
              className={`flex items-center space-x-2 font-medium text-sm ${textColor}`}>
              
              <span className="cursor-pointer font-bold">EN</span>
              <span className="opacity-50">|</span>
              <span className="cursor-pointer hover:opacity-70">AR</span>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${textColor}`}
            onClick={() => setIsMobileMenuOpen(true)}>
            
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            x: '100%'
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          exit={{
            opacity: 0,
            x: '100%'
          }}
          transition={{
            type: 'tween',
            duration: 0.3
          }}
          className="fixed inset-0 bg-white z-[60] flex flex-col">
          
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl text-gradient leading-none">
                  Jump N Slide
                </span>
                <span className="font-heading font-bold text-sm tracking-widest uppercase text-brand-pink">
                  4 Kids
                </span>
              </div>
              <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-brand-navy bg-brand-light rounded-full">
              
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col space-y-6">
              <Link
              to="/"
              className="text-2xl font-heading font-bold text-brand-navy">
              
                Home
              </Link>
              <Link
              to="/packages"
              className="text-2xl font-heading font-bold text-brand-navy">
              
                Packages
              </Link>
              <div className="pl-4 flex flex-col space-y-4 border-l-2 border-brand-light">
                {PACKAGES.map((pkg) =>
              <Link
                key={pkg.slug}
                to={`/packages/${pkg.slug}`}
                className="text-lg text-gray-600">
                
                    {pkg.name}
                  </Link>
              )}
              </div>
              <Link
              to="/gallery"
              className="text-2xl font-heading font-bold text-brand-navy">
              
                Gallery
              </Link>
              <Link
              to="/about"
              className="text-2xl font-heading font-bold text-brand-navy">
              
                About
              </Link>
              <Link
              to="/contact"
              className="text-2xl font-heading font-bold text-brand-navy">
              
                Contact
              </Link>
            </div>

            <div className="p-6 border-t border-gray-100 bg-brand-light flex justify-center space-x-4">
              <button className="px-6 py-2 bg-brand-navy text-white rounded-full font-medium">
                English
              </button>
              <button className="px-6 py-2 bg-white text-brand-navy border border-gray-200 rounded-full font-medium">
                العربية
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}