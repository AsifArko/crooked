'use client'

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

interface SourceCodeCardProps {
  sourceCode: SourceCode
  isMobile: boolean
}

export function SourceCodeCard({ sourceCode, isMobile }: SourceCodeCardProps) {
  return isMobile ? (
    <SourceCodeCardMobile sourceCode={sourceCode} />
  ) : (
    <SourceCodeCardDesktop sourceCode={sourceCode} />
  )
} 