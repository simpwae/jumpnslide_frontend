import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingsPage } from './pages/BookingsPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { PackagesPage } from './pages/PackagesPage';
import { InventoryPage } from './pages/InventoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { SettingsPage } from './pages/SettingsPage';
import { CalendarPage } from './pages/CalendarPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { FAQPage } from './pages/FAQPage';
import { WorkersPage } from './pages/WorkersPage';
import { LanguageProvider } from './context/LanguageContext';
export function AdminApp() {
  // Simple mock auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <LanguageProvider>
      {!isAuthenticated ?
      <LoginPage onLogin={() => setIsAuthenticated(true)} /> :

      <AdminLayout onLogout={() => setIsAuthenticated(false)}>
          <Routes>
            <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />} />
          
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/workers" element={<WorkersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Fallback for unknown admin routes */}
            <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />} />
          
          </Routes>
        </AdminLayout>
      }
    </LanguageProvider>);

}