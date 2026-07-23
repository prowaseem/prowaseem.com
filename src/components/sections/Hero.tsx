import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { profile } from '../../data/profile';
import { fadeInUp, staggerContainer } from '../../lib/motion';
import { scrollToSection } from '../../lib/scrollTo';

export function Hero() {
  return (
    <section id="hero" className="flex min-h-screen items-center justify-center px-6 pt-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p variants={fadeInUp} className="font-medium text-coral-500">
          {profile.title}
        </motion.p>
        <motion.h1
          variants={fadeInUp}
          className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl"
        >
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-coral-500 to-amber-400 bg-clip-text text-transparent">
            {profile.fullName}
          </span>
        </motion.h1>
        <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
          {profile.bio}
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => scrollToSection('portfolio')}>View Work</Button>
          <Button variant="secondary" onClick={() => scrollToSection('contact')}>
            Get in Touch
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
