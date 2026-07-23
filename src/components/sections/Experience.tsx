import { motion } from 'framer-motion';
import { employmentHistory } from '../../data/employment';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading eyebrow="Experience" title="Where I've worked" />
      <div className="relative mt-12 border-l border-border-subtle pl-8">
        {employmentHistory.map((entry, index) => (
          <motion.div
            key={`${entry.company}-${entry.role}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative pb-12 last:pb-0"
          >
            <span
              className={`absolute -left-[2.31rem] top-1.5 h-3 w-3 rounded-full ${
                entry.current ? 'animate-pulse bg-coral-500' : 'bg-border-subtle'
              }`}
            />
            <p className="text-sm text-ink/50">
              {entry.startDate} — {entry.endDate}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">
              {entry.role} · {entry.company}
            </h3>
            <p className="text-sm text-ink/60">{entry.location}</p>
            <ul className="mt-4 space-y-2">
              {entry.details.map((detail) => (
                <li key={detail.description} className="text-ink/70">
                  <span>{detail.description}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
