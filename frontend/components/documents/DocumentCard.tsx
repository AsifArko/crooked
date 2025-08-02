'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Calendar, ExternalLink } from 'lucide-react'

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

interface DocumentCardProps {
  document: Document
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'resume':
      return '📄'
    case 'research':
      return '🔬'
    case 'portfolio':
      return '💼'
    case 'certificate':
      return '🏆'
    default:
      return '📁'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'resume':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'research':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'portfolio':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'certificate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export function DocumentCard({ document }: DocumentCardProps) {
  const handleDownload = () => {
    window.open(document.file.asset.url, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getCategoryIcon(document.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {document.name}
                  </h3>
                  <Badge className={`text-xs ${getCategoryColor(document.category)}`}>
                    {document.category}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Description */}
            {document.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {document.description}
              </p>
            )}

            {/* Upload Date */}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Uploaded {formatDate(document.uploadedAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 