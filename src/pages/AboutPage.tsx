import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  PartyPopperIcon,
  SmileIcon,
  SparklesIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircleIcon } from
'lucide-react';
export function AboutPage() {
  const stats = [
  {
    label: 'Happy Families',
    value: '1000+',
    icon: SmileIcon
  },
  {
    label: 'Emirates Served',
    value: '7',
    icon: MapPinIcon
  },
  {
    label: 'Snack Machines',
    value: '10',
    icon: PartyPopperIcon
  },
  {
    label: 'Giant Slides',
    value: '3',
    icon: SparklesIcon
  }];

  const emirates = [
  'Ras Al Khaimah',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Abu Dhabi',
  'Fujairah'];

  return (
    <main className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-blue to-brand-purple py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="max-w-3xl mx-auto relative z-10">
          
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white mb-6">
            About Us
          </h1>
          <p className="text-white/90 text-xl font-light">
            Bringing joy, laughter, and unforgettable memories to families
            across the UAE.
          </p>
        </motion.div>
      </div>

      {/* Our Story */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="text-center mb-12">
          
          <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">
            Our Story
          </h2>
          <div className="w-24 h-1 bg-gradient-brand mx-auto rounded-full"></div>
        </motion.div>

        <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-center md:text-left">
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}>
            
            Jump N Slide 4 Kids was founded with a simple, heartfelt mission to
            make children's parties spectacular without the overwhelming stress
            for parents. We know that organizing a party can be exhausting, so
            we decided to change the game.
          </motion.p>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.1
            }}>
            
            Based in Ajman, we started small—with just one bouncy
            castle and a passion for seeing kids smile. Through word-of-mouth
            and a commitment to impeccable service, we quickly grew. Today, we
            are proud to have served over 1000+ families, expanding our reach to
            deliver joy across all 7 emirates of the UAE.
          </motion.p>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: 0.2
            }}>
            
            We don't just rent equipment, we deliver an experience. From massive
            themed slides to a paradise of snack machines, we bring the fun
            directly to your doorstep, handling everything from delivery and
            setup to supervision and pack-up.
          </motion.p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-brand-light px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600">
              Everything you need for the perfect celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              title: 'Inflatables & Slides',
              desc: 'Giant themed slides and bouncy castles that turn any backyard into an adventure park. Safe, clean, and incredibly fun.',
              icon: SparklesIcon,
              color: 'text-brand-blue',
              bg: 'bg-blue-100'
            },
            {
              title: 'Snack Machines',
              desc: 'A complete treat station featuring 10 different machines including cotton candy, popcorn, slushies, and chocolate fountains.',
              icon: PartyPopperIcon,
              color: 'text-brand-pink',
              bg: 'bg-pink-100'
            },
            {
              title: 'Full Party Setup',
              desc: 'We provide tables, chairs, balloon arches, backdrops, and even staff supervision so you can sit back and enjoy the day.',
              icon: UsersIcon,
              color: 'text-brand-purple',
              bg: 'bg-purple-100'
            }].
            map((feature, idx) =>
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                y: 30
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: idx * 0.1
              }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              
                <div
                className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-navy mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Our Numbers */}
      <section className="py-20 bg-brand-navy text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) =>
            <motion.div
              key={idx}
              initial={{
                opacity: 0,
                scale: 0.8
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: idx * 0.1,
                type: 'spring'
              }}
              className="flex flex-col items-center">
              
                <stat.icon className="w-10 h-10 text-brand-pink mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-extrabold font-heading mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl text-brand-navy mb-4">
            Our Service Area
          </h2>
          <p className="text-gray-600">
            Based in Ajman, proudly delivering to all corners of the
            UAE.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {emirates.map((emirate, idx) =>
          <motion.div
            key={idx}
            initial={{
              opacity: 0,
              x: -20
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: idx * 0.05
            }}
            className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
            
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 shrink-0" />
              <span className="font-medium text-brand-navy">{emirate}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-pink to-orange-400 text-center px-4 relative overflow-hidden">
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="max-w-2xl mx-auto relative z-10">
          
          <h2 className="font-heading font-extrabold text-4xl text-white mb-6">
            Ready to Plan Your Party?
          </h2>
          <p className="text-white/90 text-lg mb-10">
            Browse our curated packages and let us handle the heavy lifting
            while you focus on making memories.
          </p>
          <Link
            to="/packages"
            className="inline-block px-8 py-4 bg-white text-brand-pink rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            
            Explore Packages
          </Link>
        </motion.div>
      </section>
    </main>);

}