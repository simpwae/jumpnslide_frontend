import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  ShoppingCartIcon,
  PackageIcon,
  BoxIcon,
  ImageIcon,
  SettingsIcon,
  BellIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  CalendarDaysIcon,
  StarIcon,
  HelpCircleIcon,
  UsersIcon,
  GlobeIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon } from
'lucide-react';
import { useLanguage } from '../context/LanguageContext';
const MOCK_NOTIFICATIONS = [
{
  id: '1',
  type: 'booking',
  message: 'New booking #JNS-007 from Khalid M.',
  time: '5 min ago',
  read: false
},
{
  id: '2',
  type: 'payment',
  message: 'Payment uploaded for #JNS-005',
  time: '1 hour ago',
  read: false
},
{
  id: '3',
  type: 'worker',
  message: 'Ahmad Hassan assigned to event #JNS-004',
  time: '3 hours ago',
  read: true
},
{
  id: '4',
  type: 'system',
  message: 'Calendar date March 18 has been locked',
  time: '1 day ago',
  read: true
}];

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}
export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const location = useLocation();
  const { language, setLanguage, isRTL, t } = useLanguage();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllRead = () => {
    setNotifications((prev) =>
    prev.map((n) => ({
      ...n,
      read: true
    }))
    );
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <ShoppingCartIcon className="w-4 h-4 text-brand-blue" />;
      case 'payment':
        return <CheckCircleIcon className="w-4 h-4 text-emerald-500" />;
      case 'worker':
        return <UsersIcon className="w-4 h-4 text-brand-pink" />;
      case 'system':
        return <AlertCircleIcon className="w-4 h-4 text-amber-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-slate-400" />;
    }
  };
  const navigation = [
  {
    key: 'nav.dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboardIcon
  },
  {
    key: 'nav.calendar',
    href: '/admin/calendar',
    icon: CalendarDaysIcon
  },
  {
    key: 'nav.bookings',
    href: '/admin/bookings',
    icon: ShoppingCartIcon
  },
  {
    key: 'nav.packages',
    href: '/admin/packages',
    icon: PackageIcon
  },
  {
    key: 'nav.inventory',
    href: '/admin/inventory',
    icon: BoxIcon
  },
  {
    key: 'nav.gallery',
    href: '/admin/gallery',
    icon: ImageIcon
  },
  {
    key: 'nav.testimonials',
    href: '/admin/testimonials',
    icon: StarIcon
  },
  {
    key: 'nav.faq',
    href: '/admin/faq',
    icon: HelpCircleIcon
  },
  {
    key: 'nav.workers',
    href: '/admin/workers',
    icon: UsersIcon
  },
  {
    key: 'nav.settings',
    href: '/admin/settings',
    icon: SettingsIcon
  }];

  const getPageTitle = () => {
    // Exact match first, then partial match for nested routes like /bookings/:id
    const current =
    navigation.find((item) => location.pathname === item.href) ||
    navigation.find((item) => location.pathname.includes(item.href));
    return current ? t(current.key) : t('common.adminPanel');
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-body flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen &&
      <div
        className="fixed inset-0 bg-black/80 z-40 lg:hidden"
        onClick={() => setIsMobileMenuOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-64 bg-slate-900 border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
      `}>
        
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex flex-col">
            <span className="font-heading font-extrabold text-xl text-white leading-none">
              Jump N Slide
            </span>
            <span className="font-heading font-bold text-xs tracking-widest uppercase text-brand-pink">
              Admin
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] hide-scrollbar">
          {navigation.map((item) => {
            // Special handling for dashboard to avoid matching everything
            const isActive =
            item.href === '/admin/dashboard' ?
            location.pathname === '/admin/dashboard' :
            location.pathname.includes(item.href);
            return (
              <Link
                key={item.key}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  relative flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                  ${isActive ? 'bg-brand-blue/10 text-brand-blue' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-50'}
                `}>
                
                <item.icon
                  className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} shrink-0 ${isActive ? 'text-brand-blue' : 'text-slate-500 group-hover:text-slate-300'}`} />
                
                {t(item.key)}
                {isActive &&
                <div
                  className={`absolute ${isRTL ? 'right-0 rounded-l-full' : 'left-0 rounded-r-full'} w-1 h-8 bg-brand-blue`} />

                }
              </Link>);

          })}

          <div className="pt-8 mt-8 border-t border-slate-800 pb-8">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors group">
              
              <LogOutIcon
                className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'} shrink-0 text-slate-500 group-hover:text-rose-400`} />
              
              {t('nav.signOut')}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${isRTL ? 'lg:pr-64' : 'lg:pl-64'}`}>
        
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`${isRTL ? 'ml-4' : 'mr-4'} p-2 rounded-md text-slate-400 hover:text-slate-50 hover:bg-slate-800 lg:hidden`}>
              
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-heading font-semibold text-slate-100">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center p-2 text-slate-400 hover:text-slate-50 transition-colors"
              title="Toggle Language">
              
              <GlobeIcon className={`w-5 h-5 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
              <span className="text-sm font-bold uppercase">{language}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-slate-50 transition-colors">
                
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 &&
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-pink rounded-full border-2 border-slate-900"></span>
                }
              </button>

              {/* Notifications Dropdown */}
              {showNotifications &&
              <>
                  <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)} />
                
                  <div
                  className={`absolute top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden ${isRTL ? 'left-0' : 'right-0'}`}>
                  
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                      <h3 className="font-heading font-bold text-slate-100">
                        Notifications
                      </h3>
                      {unreadCount > 0 &&
                    <button
                      onClick={markAllRead}
                      className="text-xs text-brand-blue hover:text-blue-400 font-medium">
                      
                          Mark all read
                        </button>
                    }
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ?
                    <div className="p-6 text-center text-slate-500 text-sm">
                          No notifications
                        </div> :

                    <div className="divide-y divide-slate-800/50">
                          {notifications.map((notification) =>
                      <div
                        key={notification.id}
                        className={`p-4 flex gap-3 hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? 'bg-slate-800/20' : ''}`}>
                        
                              <div className="mt-0.5 bg-slate-800 p-2 rounded-full h-fit">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1">
                                <p
                            className={`text-sm ${!notification.read ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                            
                                  {notification.message}
                                </p>
                                <div className="flex items-center mt-1 text-xs text-slate-500">
                                  <ClockIcon className="w-3 h-3 mr-1" />
                                  {notification.time}
                                </div>
                              </div>
                              {!notification.read &&
                        <div className="w-2 h-2 bg-brand-blue rounded-full mt-1.5 shrink-0" />
                        }
                            </div>
                      )}
                        </div>
                    }
                    </div>
                    <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-center">
                      <button className="text-sm text-slate-400 hover:text-slate-200 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              }
            </div>

            <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-sm shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>);

}