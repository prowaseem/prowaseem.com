import { motion } from 'framer-motion';
import { useState } from 'react';
import { profile } from '../../data/profile';
import { employmentHistory } from '../../data/employment';
import { SectionHeading } from '../ui/SectionHeading';
import myPhoto from '../../assets/m-waseem.jpg';

const STATS = [
  { label: 'Years of experience', value: 11 },
  { label: 'Companies', value: employmentHistory.length },
  { label: 'Countries worked with', value: 3 },
];

function StatCounter({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  function animate() {
    if (hasAnimated) return;
    setHasAnimated(true);
    const durationMs = 1000;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  return (
    <motion.div onViewportEnter={animate} viewport={{ once: true }} className="text-center">
      <p className="font-display text-4xl font-bold text-coral-500">{count}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="About" title="A decade of shipping frontend products" />
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
        <motion.img
          src={myPhoto}
          alt="Muhammad Waseem Irshad"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto h-64 w-64 rounded-3xl object-cover shadow-xl shadow-coral-500/20"
        />
        <div>
          <p className="text-lg text-ink/70">{profile.bio}</p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
