
import React from 'react';

export interface PriceVariant {
  label: string; // e.g., "Regular", "Medium", "Large", "Half", "Full"
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  variants: PriceVariant[];
  category: 'Veg Pizzas' | 'Non-Veg Pizzas' | 'Sides' | 'Beverages' | 'Starters' | 'Pasta' | 'Burger' | 'Momo' | 'Chowmein' | 'Shake';
  subCategory?: string; // e.g., "Classic Veg", "Simple Veg"
  image: string;
  isPopular?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

