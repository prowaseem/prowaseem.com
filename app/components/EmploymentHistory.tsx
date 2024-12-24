'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const jobs = [
  {
    title: 'Senior Software Engineer',
    company: 'Tech Innovators Inc.',
    period: '2020 - Present',
    description: 'Leading development of scalable web applications using React and Node.js. Implementing CI/CD pipelines and mentoring junior developers.',
  },
  {
    title: 'Software Engineer',
    company: 'Digital Solutions Ltd.',
    period: '2017 - 2020',
    description: 'Developed and maintained multiple client projects using Angular and Express.js. Collaborated with cross-functional teams to deliver high-quality software solutions.',
  },
  {
    title: 'Junior Developer',
    company: 'StartUp Ventures',
    period: '2015 - 2017',
    description: 'Assisted in the development of a social media analytics platform. Gained experience in full-stack development and agile methodologies.',
  },
]

const EmploymentHistory = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="experience" className="py-16 bg-gradient-to-r from-green-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl font-bold text-center mb-8 font-montserrat"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          ref={ref}
        >
          Employment History
        </motion.h2>
        <div className="space-y-12">
          {jobs.map((job, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-sm text-gray-500 mb-4">{job.period}</p>
              <p className="text-gray-700">{job.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmploymentHistory

