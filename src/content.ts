/**
 * Business copy that used to be hard-coded inside individual components.
 * It is collected here word for word so the redesign can restyle it without
 * changing any fact. Edit the text here, not in the components.
 */
import { PHONE_PRIMARY, WHATSAPP_NUMBER } from './constants';

export const TEL_PRIMARY = `tel:${PHONE_PRIMARY.replace(/\s/g, '')}`; // tel:+918755613893
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const HERO_BADGE = 'Now Open in Kaladhungi';
export const HERO_COPY = 'Hand-stretched, wood-fired, and served with love in the heart of Uttarakhand.';

export const ABOUT = {
  eyebrow: 'Our Story',
  titleLine1: 'Rooted in the Hills,',
  titleLine2: 'Crafted with Passion.',
  body:
    'Pahadi Pizza was born from a simple desire: to bring world-class Italian pizza techniques to the serene landscapes of Uttarakhand. We believe that great pizza starts with great water and fresh mountain air, combined with artisanal recipes passed down through generations.',
  image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1974&auto=format&fit=crop',
  imageAlt: 'Artisanal Pizza Making',
  badgeValue: '5+',
  badgeText: 'Years of Culinary Excellence in Italian Fusion.',
};

export const CHEF = {
  eyebrow: 'Meet the Founder',
  name: 'Akash Saini',
  role: 'Founder & Head Chef, Pahadi Pizza',
  // A short note in the owner's own voice, shown as two paragraphs.
  note: [
    'I started Pahadi Pizza to bring great pizza home to Kaladhungi. For 5+ years I worked in leading kitchens across India, including popular pizza brands like the Happy Funny Pizza franchise. Now all of that goes into every pizza from our kitchen.',
    'We make sourdough and thin-crust fusion pizzas with bold local flavors, using quality ingredients so you get the same great taste on every visit. Come in, sit down and enjoy. You are always welcome here.',
  ],
  quote: 'Great pizza is all about balance: authentic methods, fresh ingredients, and flavors people love.',
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '500k+', label: 'Pizzas Served' },
    { value: 'Top 1', label: 'In Kaladhungi' },
  ],
  // Stored in the project so the photo never depends on an outside host.
  photo: '/images/chef-akash-saini.webp',
  photoAlt: 'Chef Akash Saini at Pahadi Pizza, Kaladhungi',
};

export const MAP_QUERY = 'Main Chauraha, Kaladhungi, Uttarakhand, India';
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
export const MAP_TITLE = 'Pahadi Pizza Location - Main Chauraha, Kaladhungi';

export const WHATSAPP_GROUP_MESSAGE =
  'Please add my number to Pahadi Pizza group for more new upcoming orders offer and updates';

export const FOOTER_BLURB =
  'Bringing the authentic wood-fired pizza experience to the foothills of Himalayas. Crafted with love, served with pride.';

export const CREDIT = { name: 'Sumit Kumar', url: 'https://sumit-dev-rose.vercel.app/' };

/** Same order message the site has always sent, now URL-encoded. */
export const orderMessageUrl = (itemName: string, variantLabel?: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(
    `Hi Pahadi Pizza, I want to order: ${itemName} ${variantLabel ? `(${variantLabel})` : ''}`.trim(),
  )}`;
