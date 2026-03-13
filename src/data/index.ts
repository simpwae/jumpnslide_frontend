import { Equipment, Package, FAQ, Testimonial } from '../types';

export const EQUIPMENT: Equipment[] = [
{
  id: 'slide-spiderman',
  name: 'Spider-Man Slide',
  category: 'slide',
  isLarge: true,
  dimensions: '9m H × 9m L × 4.5m W',
  imagePlaceholder: 'from-red-500 to-blue-500'
},
{
  id: 'slide-icecream',
  name: 'Ice-Cream Slide',
  category: 'slide',
  isLarge: true,
  dimensions: '9m H × 9m L × 4.5m W',
  imagePlaceholder: 'from-pink-400 to-yellow-300'
},
{
  id: 'slide-candy',
  name: 'Candy Slide',
  category: 'slide',
  isLarge: true,
  dimensions: '9m H × 9m L × 4.5m W',
  imagePlaceholder: 'from-purple-400 to-pink-400'
},
{
  id: 'bouncy-unicorn',
  name: 'Unicorn Bouncy Castle',
  category: 'bouncy',
  isLarge: false,
  imagePlaceholder: 'from-fuchsia-300 to-cyan-300'
},
{
  id: 'bouncy-spiderman',
  name: 'Spider-Man Bouncy Castle',
  category: 'bouncy',
  isLarge: false,
  imagePlaceholder: 'from-red-600 to-blue-600'
},
{
  id: 'football-playground',
  name: 'Football Playground',
  category: 'other',
  isLarge: false,
  imagePlaceholder: 'from-green-500 to-emerald-700'
},
{
  id: 'pool',
  name: 'Inflatable Pool',
  category: 'pool',
  imagePlaceholder: 'from-cyan-400 to-blue-500'
},
{
  id: 'mach-cotton',
  name: 'Cotton Candy',
  category: 'machine',
  imagePlaceholder: 'from-pink-300 to-pink-200'
},
{
  id: 'mach-popcorn',
  name: 'Popcorn',
  category: 'machine',
  imagePlaceholder: 'from-yellow-400 to-red-500'
},
{
  id: 'mach-icecream',
  name: 'Ice Cream',
  category: 'machine',
  imagePlaceholder: 'from-orange-200 to-amber-200'
},
{
  id: 'mach-slush',
  name: 'Slush',
  category: 'machine',
  imagePlaceholder: 'from-blue-400 to-cyan-300'
},
{
  id: 'mach-potato',
  name: 'Potato Swirl',
  category: 'machine',
  imagePlaceholder: 'from-yellow-500 to-amber-600'
},
{
  id: 'mach-choco',
  name: 'Choco Fountain',
  category: 'machine',
  imagePlaceholder: 'from-amber-800 to-amber-900'
},
{
  id: 'mach-chips',
  name: 'Finger Chips',
  category: 'machine',
  imagePlaceholder: 'from-yellow-400 to-yellow-500'
},
{
  id: 'mach-nuggets',
  name: 'Nuggets',
  category: 'machine',
  imagePlaceholder: 'from-orange-400 to-orange-500'
},
{
  id: 'mach-pancakes',
  name: 'Pancakes',
  category: 'machine',
  imagePlaceholder: 'from-amber-200 to-amber-400'
},
{
  id: 'mach-corn',
  name: 'Sweet Corn',
  category: 'machine',
  imagePlaceholder: 'from-yellow-300 to-yellow-400'
}];


export const PACKAGES: Package[] = [
{
  slug: 'snack-fiesta',
  name: 'Snack Fiesta',
  price: 950,
  description:
  'A paradise of treats! Perfect for gatherings where snacks are the main event.',
  highlights: [
  'Choose any 3 snack machines',
  '30 servings per machine',
  'Setup & delivery included'],

  inclusions: {
    selectableInflatables: 0,
    inflatableOptions: ['none'],
    selectableMachines: 3,
    fixedMachines: [],
    poolOption: 'none',
    fixedItems: [],
    freeItems: []
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  rating: 4.7,
  reviewCount: 18,
  bookingCount: 45
},
{
  slug: 'game-day',
  name: 'Game Day',
  price: 1299,
  description:
  'Score big with our football playground and classic party snacks.',
  highlights: [
  'Football Playground included',
  'Popcorn, Ice Cream & Cotton Candy',
  '30 servings per machine'],

  inclusions: {
    selectableInflatables: 0,
    inflatableOptions: ['none'],
    selectableMachines: 0,
    fixedMachines: ['mach-popcorn', 'mach-icecream', 'mach-cotton'],
    poolOption: 'none',
    fixedItems: ['Football Playground'],
    freeItems: []
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  rating: 4.8,
  reviewCount: 24,
  bookingCount: 62
},
{
  slug: 'slide-and-munch',
  name: 'Slide & Munch',
  price: 1399,
  description:
  "The classic party combo: a giant slide and everyone's favorite snacks.",
  highlights: [
  'Choose 1 Giant Slide',
  'Popcorn, Ice Cream & Cotton Candy',
  '30 servings per machine'],

  inclusions: {
    selectableInflatables: 1,
    inflatableOptions: ['slides'],
    selectableMachines: 0,
    fixedMachines: ['mach-popcorn', 'mach-icecream', 'mach-cotton'],
    poolOption: 'none',
    fixedItems: [],
    freeItems: []
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  rating: 4.9,
  reviewCount: 31,
  bookingCount: 89
},
{
  slug: 'party-starter',
  name: 'Party Starter',
  price: 1799,
  description:
  'Everything you need to kick off an amazing celebration with seating and music.',
  highlights: [
  'Choose ANY 1 Inflatable',
  'Choose ANY 3 Snack Machines',
  'Includes seating, speaker & decor'],

  inclusions: {
    selectableInflatables: 1,
    inflatableOptions: ['all'],
    selectableMachines: 3,
    fixedMachines: [],
    poolOption: 'none',
    fixedItems: ['10 Kids Chairs', '2 Kids Tables'],
    freeItems: ['Speaker System', 'Balloon Arch']
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  tag: { label: 'Best Value', type: 'value' },
  rating: 4.9,
  reviewCount: 56,
  bookingCount: 142
},
{
  slug: 'splash-zone',
  name: 'Splash Zone',
  price: 1600,
  description: 'Beat the heat with our water slide setup and sweet treats.',
  highlights: [
  'Choose 1 Slide + Pool',
  'Potato Swirl, Choco Fountain, Ice Cream',
  'FREE Mini Bouncy Castle'],

  inclusions: {
    selectableInflatables: 1,
    inflatableOptions: ['slides'],
    selectableMachines: 0,
    fixedMachines: ['mach-potato', 'mach-choco', 'mach-icecream'],
    poolOption: 'included',
    fixedItems: [],
    freeItems: ['Mini Bouncy Castle (Unicorn or Spider-Man)']
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  rating: 4.8,
  reviewCount: 42,
  bookingCount: 115
},
{
  slug: 'fun-combo',
  name: 'Fun Combo',
  price: 1699,
  description:
  'A flexible package with great decor and seating for the kids.',
  highlights: [
  'Choose 1 Slide OR Bouncy',
  'Choose ANY 3 Snack Machines',
  'Includes seating & balloon decor'],

  inclusions: {
    selectableInflatables: 1,
    inflatableOptions: ['all'],
    selectableMachines: 3,
    fixedMachines: [],
    poolOption: 'optional',
    fixedItems: ['10 Kids Chairs', '2 Kids Tables', 'Balloon Arch'],
    freeItems: ['Balloon Standy']
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  rating: 4.7,
  reviewCount: 28,
  bookingCount: 76
},
{
  slug: 'birthday-bash',
  name: 'Birthday Bash',
  price: 1999,
  description:
  'The ultimate themed decor package for a picture-perfect birthday.',
  highlights: [
  'Full Theme Decor Setup',
  'Choose ANY 3 Snack Machines',
  'Face Painting & Games included'],

  inclusions: {
    selectableInflatables: 0,
    inflatableOptions: ['none'],
    selectableMachines: 3,
    fixedMachines: [],
    poolOption: 'none',
    fixedItems: [
    'Backdrop & Welcome Board',
    'Cake Stand & Gift Table',
    'Kids Chairs & Tables with Decor',
    'Table Accessories & Printed Tissue',
    'Water Bottles & Table Decor Pieces'],

    freeItems: ['Gift Bags', 'Face Painting', 'Party Games']
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  rating: 5.0,
  reviewCount: 15,
  bookingCount: 34
},
{
  slug: 'ultimate-party',
  name: 'Ultimate Party',
  price: 2499,
  description:
  'The absolute best we offer. Full decor, inflatables, snacks, and activities.',
  highlights: [
  'Choose ANY 1 Inflatable',
  'Full Theme Decor Setup',
  'Choose ANY 3 Snack Machines',
  'All activities & freebies included'],

  inclusions: {
    selectableInflatables: 1,
    inflatableOptions: ['all'],
    selectableMachines: 3,
    fixedMachines: [],
    poolOption: 'optional',
    fixedItems: [
    'Backdrop & Welcome Board',
    'Cake Stand & Gift Table',
    'Kids Chairs & Tables with Decor',
    'Table Accessories & Printed Tissue',
    'Water Bottles & Table Decor Pieces'],

    freeItems: ['Gift Bags', 'Face Painting', 'Party Games']
  },
  duration: '4-6 hours',
  servingsPerMachine: 30,
  tag: { label: 'Most Popular', type: 'popular' },
  rating: 5.0,
  reviewCount: 89,
  bookingCount: 210
}];


export const FAQS: FAQ[] = [
{
  id: '1',
  question: 'How do I book a package?',
  answer:
  'Simply browse our packages, click "View Details", customize your setup, and select your date. You\'ll pay a 50% advance to secure your booking.'
},
{
  id: '2',
  question: 'What areas do you deliver to?',
  answer:
  'We are based in Ras Al Khaimah but we deliver to all 7 UAE emirates! Delivery charges vary based on your location and will be calculated at checkout.'
},
{
  id: '3',
  question: 'How long is the rental period?',
  answer:
  'All our packages include a standard rental duration of 4 to 6 hours. We will coordinate exact setup and pickup times with you.'
},
{
  id: '4',
  question: 'Are the inflatables safe and clean?',
  answer:
  'Absolutely. Safety is our top priority. All equipment is thoroughly sanitized before and after every use, and our professional staff ensures safe setup and supervision.'
},
{
  id: '5',
  question: 'Can I add extra servings to the snack machines?',
  answer:
  'Yes! All machines come with 30 servings by default. You can easily add extra servings in increments of 10 during the customization step.'
},
{
  id: '6',
  question: 'What is your cancellation policy?',
  answer:
  'All bookings are final and the 50% advance payment is non-refundable. However, you can modify your booking date up to 3 days before the event, subject to availability.'
},
{
  id: '7',
  question: 'Do you provide staff to operate the machines?',
  answer:
  'Yes, our packages include professional staff to operate the snack machines and supervise the inflatables. Both male and female staff are available upon request.'
},
{
  id: '8',
  question: 'What happens if it rains or is too windy?',
  answer:
  "In case of severe weather (rain, high winds, extreme heat), we may need to pause or cancel outdoor setups for safety. We will work with you to reschedule at management's discretion."
}];


export const TESTIMONIALS: Testimonial[] = [
{
  id: '1',
  name: 'Sarah Ahmed',
  rating: 5,
  text: 'Absolutely amazing service! The team arrived early, set up everything perfectly, and the kids had the time of their lives on the Spider-Man slide. Highly recommend!',
  packageName: 'Ultimate Party',
  date: 'October 2025',
  isFeatured: true,
  adminReply:
  "Thank you Sarah! We loved being part of your son's special day."
},
{
  id: '2',
  name: 'Mohammed R.',
  rating: 5,
  text: 'Very professional. The snack machines were a huge hit, especially the cotton candy. The staff was polite and handled all the kids so well.',
  packageName: 'Party Starter',
  date: 'November 2025',
  isFeatured: true
},
{
  id: '3',
  name: 'Fatima Al Suwaidi',
  rating: 4,
  text: "Great experience overall. The bouncy castle was clean and looked brand new. Only wish we had booked it for longer because the kids didn't want to leave!",
  packageName: 'Splash Zone',
  date: 'December 2025',
  isFeatured: true,
  adminReply:
  'Thank you Fatima! Next time we can definitely arrange an extended duration for you.'
},
{
  id: '4',
  name: 'David C.',
  rating: 5,
  text: 'The Birthday Bash package took all the stress out of party planning. The decor was beautiful and exactly as promised.',
  packageName: 'Birthday Bash',
  date: 'January 2026',
  isFeatured: false
}];