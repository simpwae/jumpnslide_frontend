export interface Equipment {
  id: string;
  name: string;
  category:
  'slide' |
  'bouncy' |
  'other' |
  'pool' |
  'machine' |
  'furniture' |
  'decor' |
  'activity';
  isLarge?: boolean; // For pool compatibility
  dimensions?: string;
  imagePlaceholder: string;
}

export interface Package {
  slug: string;
  name: string;
  price: number;
  description: string;
  highlights: string[];
  inclusions: {
    selectableInflatables: number;
    inflatableOptions: string[]; // 'all', 'slides', 'bouncies', 'none'
    selectableMachines: number;
    fixedMachines: string[];
    poolOption: 'included' | 'optional' | 'none';
    fixedItems: string[];
    freeItems: Array<{ name: string; isChoice?: boolean }>;
  };
  duration: string;
  servingsPerMachine: number;
  tag?: {
    label: string;
    type: 'popular' | 'value' | 'deal' | 'new' | 'premium' | 'limited';
  };
  rating: number;
  reviewCount: number;
  bookingCount: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  packageName: string;
  date: string;
  isFeatured: boolean;
  adminReply?: string;
}