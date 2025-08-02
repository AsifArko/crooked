'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Calendar, TrendingUp } from 'lucide-react'

interface ContributionDay {
  date: string
  contributionCount: number
}

interface GitHubContributionsProps {
  username: string
}

export function GitHubContributions({ username }: GitHubContributionsProps) {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/github/contributions?username=${username}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch contributions')
        }
        
        const data = await response.json()
        setContributions(data.contributions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contributions')
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchContributions()
    }
  }, [username])

  const getContributionColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (count <= 3) return 'bg-green-200 dark:bg-green-900'
    if (count <= 6) return 'bg-green-300 dark:bg-green-800'
    if (count <= 9) return 'bg-green-400 dark:bg-green-700'
    return 'bg-green-500 dark:bg-green-600'
  }

  const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0)
  const activeDays = contributions.filter(day => day.contributionCount > 0).length

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Github className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load GitHub contributions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>GitHub Contributions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalContributions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Contributions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeDays}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Days
                </div>
              </div>
            </div>

            {/* Contribution Graph */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last 365 days
                </span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              
              <div className="grid grid-cols-53 gap-1">
                {contributions.slice(-365).map((day, index) => (
                  <motion.div
                    key={day.date}
                    className={`w-2 h-2 rounded-sm ${getContributionColor(day.contributionCount)}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.001 }}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-200 dark:bg-green-900 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-300 dark:bg-green-800 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-400 dark:bg-green-700 rounded-sm"></div>
                <div className="w-2 h-2 bg-green-500 dark:bg-green-600 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 