import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import {
  PackageIcon,
  CalendarIcon,
  PartyPopperIcon,
  ChevronDownIcon,
  StarIcon,
  ImageIcon,
  MapPinIcon,
} from 'lucide-react';
import { PackageCard } from '../components/PackageCard';
import { PACKAGES, TESTIMONIALS, FAQS } from '../data';

// --- Local Components ---

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    'from-brand-blue to-brand-purple',
    'from-brand-purple to-brand-pink',
    'from-brand-pink to-orange-400',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide]}`}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-brand-navy/40" />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-brand-pink/20 rounded-full blur-2xl"
      />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 leading-tight"
        >
          Your Party.
          <br />
          Our Setup.
          <br />
          Their Smiles.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
        >
          Inflatables, snack machines, themed decorations — delivered to your
          doorstep across UAE.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <button
            onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-brand hover:bg-gradient-brand-hover text-white rounded-full font-bold text-lg shadow-xl hover:shadow-brand-pink/30 hover:-translate-y-1 transition-all duration-300"
          >
            Explore Packages
          </button>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-xl mr-2">✨</span>
            <span className="text-white text-sm font-medium">
              Trusted by 400+ happy families across UAE
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: PackageIcon, title: 'Choose Your Package', desc: 'Browse our curated packages or build your own' },
    { icon: CalendarIcon, title: 'Pick Your Date', desc: 'Select your preferred date and time' },
    { icon: PartyPopperIcon, title: 'We Set Up, You Celebrate', desc: 'Our team handles everything while you enjoy' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-brand-navy inline-block relative">
            How It Works
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-brand rounded-full" />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0" />
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center mb-6 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-brand text-white font-bold flex items-center justify-center shadow-md">
                  {idx + 1}
                </div>
                <step.icon className="w-10 h-10 text-brand-blue" />
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-navy mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPackages() {
  const featuredSlugs = ['ultimate-party', 'party-starter', 'splash-zone', 'snack-fiesta'];
  const featured = featuredSlugs.map((slug) => PACKAGES.find((p) => p.slug === slug)!).filter(Boolean);

  return (
    <section id="packages" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-brand-navy mb-4">
            Our Most Popular Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Carefully curated combinations to make your party planning effortless.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featured.map((pkg) => <PackageCard key={pkg.slug} pkg={pkg} />)}
        </div>
        <div className="text-center flex flex-col items-center">
          <Link
            to="/packages"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-blue transition-colors mb-4"
          >
            View All Packages →
          </Link>
          <span className="text-sm text-gray-500">Not sure which one? Compare packages →</span>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const points = [
    { emoji: '🛝', title: 'Massive Themed Slides', desc: 'Three uniquely themed giant slides that turn any space into an adventure park' },
    { emoji: '🎉', title: 'All-In-One Party Setup', desc: 'From inflatables to snacks to decorations — we handle everything so you can relax' },
    { emoji: '🔒', title: 'Child Safety Guaranteed', desc: 'Professional staff supervision with safety-first equipment and protocols' },
    { emoji: '🍿', title: '10 Snack Machines', desc: 'Cotton candy, popcorn, ice cream, slush and more — a snack paradise for kids' },
    { emoji: '🚚', title: 'We Come To You', desc: 'Serving all 7 emirates — we deliver, set up, and pack up at your location' },
    { emoji: '👫', title: 'Male & Female Staff', desc: 'Comfortable for all families with both male and female team members available' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-brand-navy">Why Families Choose Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-brand-light hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center text-2xl mb-6 shadow-lg">
                {point.emoji}
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-navy mb-3">{point.title}</h3>
              <p className="text-gray-600 leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentEvents() {
  const [featuredAlbums, setFeaturedAlbums] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('gallery_albums')
      .select('*')
      .eq('is_featured', true)
      .gt('photo_count', 0)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setFeaturedAlbums(data);
      });
  }, []);

  if (featuredAlbums.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-navy mb-4">
            Our Recent Events
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Real parties, real smiles. See what we've been creating for families across the UAE.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredAlbums.map((album, idx) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to="/gallery"
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="relative h-52 bg-gray-200 overflow-hidden">
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-bold text-sm">{album.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
                      {album.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" />{album.location}
                        </span>
                      )}
                      {album.event_date && <span>• {album.event_date}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center px-8 py-3 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-blue transition-colors"
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="py-24 bg-brand-navy text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="font-heading font-bold text-4xl mb-4">Moments We Have Created</h2>
            <p className="text-gray-400 max-w-xl">A glimpse into the joy and excitement we bring to every event.</p>
          </div>
          <Link
            to="/gallery"
            className="hidden md:inline-flex px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
          >
            View Full Gallery →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {['from-blue-400 to-purple-500', 'from-pink-400 to-orange-400', 'from-emerald-400 to-cyan-500', 'from-amber-400 to-red-500'].map((bg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`aspect-square rounded-2xl bg-gradient-to-br ${bg} relative group overflow-hidden cursor-pointer`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/50 px-4 py-2 rounded-full transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  View
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        <Link
          to="/gallery"
          className="md:hidden w-full inline-flex justify-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
        >
          View Full Gallery →
        </Link>
      </div>
    </section>
  );
}

function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
        else setTestimonials(TESTIMONIALS.filter(t => t.isFeatured));
      });
  }, []);

  return (
    <section className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-brand-navy mb-4">
            What Parents Say
          </h2>
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="font-bold text-brand-navy mr-2">4.8</span>
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-gray-600 text-sm">from 47 families</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 flex-1">"{review.text}"</p>
              <div className="border-t border-gray-50 pt-4">
                <p className="font-bold text-brand-navy">{review.name}</p>
                <p className="text-sm text-brand-pink">
                  {review.package_name || review.packageName} · {review.date}
                </p>
              </div>
              {(review.admin_reply || review.adminReply) && (
                <div className="mt-4 bg-brand-light p-4 rounded-xl text-sm">
                  <p className="font-bold text-brand-navy mb-1">Jump N Slide 4 Kids replied:</p>
                  <p className="text-gray-600">{review.admin_reply || review.adminReply}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (data) setFaqs(data);
      });
  }, []);

  const displayFaqs = faqs.length > 0 ? faqs : FAQS.slice(0, 6);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-brand-navy">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {displayFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-brand-navy pr-4">{faq.question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-brand-pink shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/contact"
            className="text-brand-blue font-medium hover:underline"
          >
            Have more questions? Contact us →
          </Link>
        </div>
      </div>
    </section>
  );
}

           

// --- Main Export ---
export function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <FeaturedPackages />
      <WhyChooseUs />
      <RecentEvents />
      <GalleryPreview />
      <Testimonials />
      <FAQSection />
    </main>
  );
}