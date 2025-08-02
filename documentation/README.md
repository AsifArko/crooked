# Portfolio Website Documentation

## Project Overview
This is a portfolio website built with Next.js and Sanity CMS. The application serves as a personal portfolio with the following features:

### Core Features
- **Source Code Marketplace**: Upload and sell GitHub projects with Stripe integration
- **Document Management**: Upload and serve static documents (resume, research files, etc.)
- **Image Management**: Profile pictures and other images
- **GitHub Integration**: Display GitHub contribution graph
- **Mobile-First Design**: Responsive components for mobile, tablet, and desktop

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Sanity CMS
- **Payments**: Stripe
- **Animations**: Framer Motion
- **GitHub Integration**: GitHub API

### Schema Structure

#### SourceCode Schema
- Title, slug, description
- GitHub repository URL
- Demo URL
- Price (USD) - Dynamic Stripe checkout sessions
- Main image and additional images
- Technologies used
- Features list
- README content
- Publication status

#### Document Schema
- Named file uploads (resume, research files, etc.)
- Category classification
- Public/private visibility
- Upload timestamp

#### Image Schema
- Named image uploads
- Category classification (profile, portfolio, etc.)
- Alt text for accessibility
- Public/private visibility

### Component Architecture
- Mobile-first responsive design
- Separate components for mobile, tablet, and desktop
- Reusable, configurable components
- Proper TypeScript typing
- Clean import structure using index files

### Current Implementation Status

#### ✅ Completed
- **Sanity Schemas**: SourceCode, Document, Image schemas configured
- **Hero Component**: Mobile-first design with animations
- **Source Code Components**: Grid and card components with Stripe integration
- **Document Components**: Grid and card components for file downloads
- **GitHub Integration**: Contribution graph component and API route
- **Stripe Integration**: Dynamic checkout session creation
- **Mobile-First Design**: Responsive components for all screen sizes
- **Animations**: Framer Motion animations throughout the app
- **shadcn/ui Integration**: All necessary components installed and configured

#### 🔄 In Progress
- **Sanity Studio**: Schema updates and configuration
- **API Routes**: Additional endpoints for data fetching
- **Environment Setup**: Configuration documentation

#### 📋 TODO
- **Real Data Integration**: Connect to actual Sanity data
- **Success Pages**: Stripe success and cancel pages
- **Error Handling**: Comprehensive error boundaries
- **Testing**: Unit and integration tests
- **Performance**: Optimization and caching
- **SEO**: Meta tags and sitemap updates

### Development Guidelines
- Clean, small, reusable functions/components
- Full test coverage
- No relative imports (use proper index files)
- No TypeScript errors
- No ESLint errors
- No build errors
- No PostCSS errors

### File Structure
```
frontend/
├── app/
│   ├── api/
│   │   ├── stripe/create-checkout-session/
│   │   └── github/contributions/
│   ├── components/
│   │   ├── hero/
│   │   ├── source-code/
│   │   ├── documents/
│   │   ├── github/
│   │   ├── layout/
│   │   └── ui/
│   └── page.tsx
├── components/
│   ├── index.ts
│   └── ui/
└── documentation/
    ├── README.md
    └── ENVIRONMENT.md
```

### Getting Started
1. Set up environment variables (see ENVIRONMENT.md)
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access Sanity Studio: `npm run dev` in studio directory 