import { motion } from 'framer-motion';
import { skillGroups } from '../../data/skills';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { staggerContainer, fadeInUp } from '../../lib/motion';

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Skills" title="Technologies I work with" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-12 grid gap-8 sm:grid-cols-2"
      >
        {skillGroups.map((group) => (
          <motion.div key={group.category} variants={fadeInUp}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink/50">
              {group.category}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
