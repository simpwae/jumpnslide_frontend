import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { PackagesPage } from './pages/PackagesPage';
import { PackagePage } from './pages/PackagePage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AdminApp } from './admin/AdminApp';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function AppRoutes() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>);

  }
  return (
    <div className="flex flex-col min-h-screen font-body">
      <Navbar />
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:slug" element={<PackagePage />} />
            <Route path="/book/:slug" element={<BookingPage />} />
            <Route path="/payment/:ref" element={<PaymentPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>);

}
export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>);

}