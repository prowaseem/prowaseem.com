import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { filterProjects, type FilterOption } from '../../lib/filterProjects';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const FILTERS: FilterOption[] = ['All', 'AI/Agents', 'Full-Stack', 'Enterprise'];

const GRADIENTS = ['from-coral-500 to-amber-400', 'from-amber-400 to-pink-400', 'from-pink-400 to-coral-500'];

export function Portfolio() {
  const [filter, setFilter] = useState<FilterOption>('All');
  const visibleProjects = filterProjects(projects, filter);

  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Portfolio" title="Selected work" />

      <div className="mt-8 flex flex-wrap gap-3">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === option
                ? 'border-coral-500 bg-coral-500 text-white'
                : 'border-border-subtle text-ink/70 hover:border-coral-500 hover:text-coral-500'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className={`h-24 w-full rounded-2xl bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`} />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{project.title}</h3>
                <p className="text-sm text-ink/50">{project.company}</p>
                <p className="mt-2 text-sm text-ink/70">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
