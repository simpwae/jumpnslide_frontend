import React, { useEffect, useState, createContext, useContext } from 'react';
type Language = 'en' | 'ar';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.calendar': 'Calendar',
    'nav.bookings': 'Bookings',
    'nav.packages': 'Packages',
    'nav.inventory': 'Inventory',
    'nav.gallery': 'Gallery',
    'nav.testimonials': 'Testimonials',
    'nav.faq': 'FAQs',
    'nav.workers': 'Workers',
    'nav.settings': 'Settings',
    'nav.signOut': 'Sign Out',
    // Common
    'common.adminPanel': 'Admin Panel',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.view': 'View',
    'common.manage': 'Manage',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.featured': 'Featured',
    'common.notFeatured': 'Not Featured',
    'common.yes': 'Yes',
    'common.no': 'No',
    // Testimonials
    'testimonials.title': 'Testimonials Management',
    'testimonials.desc': 'Manage customer reviews and testimonials.',
    'testimonials.add': 'Add Testimonial',
    'testimonials.customer': 'Customer',
    'testimonials.rating': 'Rating',
    'testimonials.review': 'Review',
    'testimonials.package': 'Package',
    'testimonials.date': 'Date',
    'testimonials.adminReply': 'Admin Reply',
    'testimonials.empty': 'No testimonials found.',
    // FAQ
    'faq.title': 'FAQ Management',
    'faq.desc': 'Manage frequently asked questions and answers.',
    'faq.add': 'Add FAQ',
    'faq.question': 'Question',
    'faq.answer': 'Answer',
    'faq.empty': 'No FAQs found.',
    // Workers
    'workers.title': 'Workers Management',
    'workers.desc': 'Manage staff, roles, and event assignments.',
    'workers.add': 'Add Worker',
    'workers.name': 'Name',
    'workers.role': 'Role',
    'workers.phone': 'Phone',
    'workers.events': 'Events This Month',
    'workers.totalWorkers': 'Total Workers',
    'workers.activeWorkers': 'Active Workers',
    'workers.inactiveWorkers': 'Inactive Workers',
    'workers.totalEvents': 'Total Events'
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.calendar': 'التقويم',
    'nav.bookings': 'الحجوزات',
    'nav.packages': 'الباقات',
    'nav.inventory': 'المخزون',
    'nav.gallery': 'المعرض',
    'nav.testimonials': 'التقييمات',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.workers': 'العمال',
    'nav.settings': 'الإعدادات',
    'nav.signOut': 'تسجيل الخروج',
    // Common
    'common.adminPanel': 'لوحة الإدارة',
    'common.add': 'إضافة',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.view': 'عرض',
    'common.manage': 'إدارة',
    'common.actions': 'إجراءات',
    'common.status': 'الحالة',
    'common.active': 'نشط',
    'common.inactive': 'غير نشط',
    'common.featured': 'مميز',
    'common.notFeatured': 'غير مميز',
    'common.yes': 'نعم',
    'common.no': 'لا',
    // Testimonials
    'testimonials.title': 'إدارة التقييمات',
    'testimonials.desc': 'إدارة تقييمات وآراء العملاء.',
    'testimonials.add': 'إضافة تقييم',
    'testimonials.customer': 'العميل',
    'testimonials.rating': 'التقييم',
    'testimonials.review': 'المراجعة',
    'testimonials.package': 'الباقة',
    'testimonials.date': 'التاريخ',
    'testimonials.adminReply': 'رد الإدارة',
    'testimonials.empty': 'لا توجد تقييمات.',
    // FAQ
    'faq.title': 'إدارة الأسئلة الشائعة',
    'faq.desc': 'إدارة الأسئلة والأجوبة الشائعة.',
    'faq.add': 'إضافة سؤال',
    'faq.question': 'السؤال',
    'faq.answer': 'الجواب',
    'faq.empty': 'لا توجد أسئلة شائعة.',
    // Workers
    'workers.title': 'إدارة العمال',
    'workers.desc': 'إدارة الموظفين والأدوار وتعيينات الفعاليات.',
    'workers.add': 'إضافة عامل',
    'workers.name': 'الاسم',
    'workers.role': 'الدور',
    'workers.phone': 'الهاتف',
    'workers.events': 'فعاليات هذا الشهر',
    'workers.totalWorkers': 'إجمالي العمال',
    'workers.activeWorkers': 'العمال النشطين',
    'workers.inactiveWorkers': 'العمال غير النشطين',
    'workers.totalEvents': 'إجمالي الفعاليات'
  }
};
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
export function LanguageProvider({ children }: {children: React.ReactNode;}) {
  const [language, setLanguage] = useState<Language>('en');
  const isRTL = language === 'ar';
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    if (isRTL) {
      document.documentElement.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('font-arabic');
    }
  }, [isRTL]);
  const t = (key: string) => {
    return translations[language][key] || key;
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t
      }}>
      
      {children}
    </LanguageContext.Provider>);

}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}