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
  eyebrow: 'Meet the Chef',
  name: 'Chef Akash Saini',
  intro: 'He mixes modern pizza methods with bold, local flavors.',
  points: [
    {
      label: 'Experience',
      text: '5+ years in leading kitchens across India, including popular pizza brands like the Happy Funny Pizza franchise.',
    },
    { label: 'Speciality', text: 'Sourdough and thin-crust fusion pizzas.' },
    { label: 'Promise', text: 'Quality ingredients and the same great taste, every time.' },
  ],
  quote: 'Great pizza is all about balance: authentic methods, fresh ingredients, and flavors people love.',
  stats: [
    { value: '5+', label: 'Years Experience' },
    { value: '100k+', label: 'Pizzas Served' },
    { value: 'Top 1', label: 'In Kaladhungi' },
  ],
  photo: 'https://pms-tool.s3.eu-west-1.amazonaws.com/1766409646086.jpeg',
  photoFallback: 'https://images.unsplash.com/photo-1577219491135-ce391730fbaf?q=80&w=1200&auto=format&fit=crop',
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
