'use client'

import { Element } from 'react-scroll'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Bio from './components/Bio'
import EmploymentHistory from './components/EmploymentHistory'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Element name="about">
        <Hero />
      </Element>
      <Element name="bio">
        <Bio />
      </Element>
      <Element name="experience">
        <EmploymentHistory />
      </Element>
      <Element name="portfolio">
        <Portfolio />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>
    </main>
  )
}

