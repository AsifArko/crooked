import { Suspense } from 'react'
import { Hero } from '@/components/hero/Hero'
import { SourceCodeGrid } from '@/components/source-code/SourceCodeGrid'
import { DocumentGrid } from '@/components/documents/DocumentGrid'
import { GitHubContributions } from '@/components/github/GitHubContributions'
import { Loading } from '@/components/layout/Loading'

// Mock data for development
const mockSourceCodes = [
  {
    _id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A full-stack e-commerce platform built with Next.js, TypeScript, and Stripe integration.',
    githubUrl: 'https://github.com/example/ecommerce',
    demoUrl: 'https://demo-ecommerce.vercel.app',
    price: 99,
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    features: ['User authentication', 'Payment processing', 'Admin dashboard', 'Responsive design'],
    isPublished: true,
  },
  {
    _id: '2',
    title: 'Task Management App',
    slug: 'task-management-app',
    description: 'A collaborative task management application with real-time updates and team features.',
    githubUrl: 'https://github.com/example/task-app',
    demoUrl: 'https://task-app-demo.vercel.app',
    price: 79,
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    features: ['Real-time collaboration', 'Task assignments', 'Progress tracking', 'Team management'],
    isPublished: true,
  },
]

const mockDocuments = [
  {
    _id: '1',
    name: 'Asif Arko - Resume',
    category: 'resume',
    description: 'My latest resume with skills, experience, and projects.',
    file: {
      asset: {
        url: '/api/documents/resume.pdf'
      }
    },
    isPublic: true,
    uploadedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '2',
    name: 'Research Paper - AI in Web Development',
    category: 'research',
    description: 'A comprehensive research paper on the impact of AI in modern web development.',
    file: {
      asset: {
        url: '/api/documents/research-ai.pdf'
      }
    },
    isPublic: true,
    uploadedAt: '2024-01-10T14:30:00Z',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<Loading />}>
        <Hero />
        
        {/* GitHub Contributions Section */}
        <section className="py-16 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <GitHubContributions username="asifarko" />
          </div>
        </section>

        {/* Source Code Projects Section */}
        <SourceCodeGrid sourceCodes={mockSourceCodes} />
        
        {/* Documents Section */}
        <DocumentGrid documents={mockDocuments} />
      </Suspense>
    </main>
  )
}
