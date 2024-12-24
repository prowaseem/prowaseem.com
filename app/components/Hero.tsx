'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const Hero = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text font-montserrat">
            Hi, I'm M. Waseem
          </h1>
          <h2 className="text-2xl mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text font-montserrat">
            Senior Software Engineer & Problem Solver
          </h2>
          <p className="text-gray-600 mb-8">
            I specialize in building robust and scalable web applications using cutting-edge technologies.
            With a passion for clean code and user-centric design, I strive to create impactful digital experiences.
          </p>
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Image
            src="/placeholder.svg"
            alt="John Doe"
            width={500}
            height={500}
            className="rounded-full"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

