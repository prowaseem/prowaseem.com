'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Bio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="bio" className="py-16 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold text-center mb-8 font-montserrat"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          ref={ref}
        >
          My Journey
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-4">Education</h3>
            <p className="text-gray-600 mb-4">
              I graduated with a Bachelor's degree in Computer Science from XYZ University in 2015.
              During my time there, I developed a strong foundation in algorithms, data structures, and software engineering principles.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Skills</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>JavaScript, TypeScript, Python</li>
              <li>React, Next.js, Node.js</li>
              <li>GraphQL, REST APIs</li>
              <li>AWS, Docker, CI/CD</li>
              <li>Agile methodologies</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Bio

