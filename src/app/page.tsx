'use client';

import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Menu from '../components/Menu';
import Chef from '../components/Chef';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';

export default function Home() {

  return (
    <div className="min-h-screen selection:bg-red-100 selection:text-red-600">
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Chef />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}
