'use client'

import { motion } from 'framer-motion'
import { DocumentCard } from './DocumentCard'

interface Document {
  _id: string
  name: string
  category: string
  description?: string
  file: {
    asset: {
      url: string
    }
  }
  isPublic: boolean
  uploadedAt: string
}

interface DocumentGridProps {
  documents: Document[]
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

export function DocumentGrid({ documents }: DocumentGridProps) {
  const publicDocuments = documents.filter(doc => doc.isPublic)

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documents & Resources
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Download my resume, research papers, and other important documents.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {publicDocuments.map((document) => (
            <DocumentCard key={document._id} document={document} />
          ))}
        </motion.div>

        {publicDocuments.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              No documents available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
} 