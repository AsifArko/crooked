'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SourceCodeCard } from './SourceCodeCard'
import { SourceCodeCardMobile } from './SourceCodeCardMobile'
import { SourceCodeCardDesktop } from './SourceCodeCardDesktop'

interface SourceCode {
  _id: string
  title: string
  slug: string
  description: string
  githubUrl: string
  demoUrl?: string
  price: number
  mainImage?: {
    asset: {
      url: string
    }
  }
  technologies: string[]
  features: string[]
  isPublished: boolean
}

interface SourceCodeGridProps {
  sourceCodes: SourceCode[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function SourceCodeGrid({ sourceCodes }: SourceCodeGridProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const publishedSourceCodes = sourceCodes.filter(code => code.isPublished)

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Source Code Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore and purchase high-quality source code projects. Each project includes 
            complete documentation and support.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {publishedSourceCodes.map((sourceCode) => (
            <SourceCodeCard
              key={sourceCode._id}
              sourceCode={sourceCode}
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        {publishedSourceCodes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              No source code projects available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
} 