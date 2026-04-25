/**
 * Mock data fixtures for testing
 */

// GitHub API mock data
export const githubMockData = {
  contributions: {
    totalContributions: 1234,
    contributionsByYear: [
      {
        year: 2024,
        total: 456,
        contributions: [
          { date: "2024-01-01", count: 5 },
          { date: "2024-01-02", count: 3 },
          { date: "2024-01-03", count: 8 },
        ],
      },
    ],
  },
  activity: {
    commits: 85,
    issues: 12,
    pullRequests: 23,
    codeReviews: 45,
  },
};

// Stripe API mock data
export const stripeMockData = {
  session: {
    id: "cs_test_session_123",
    url: "https://checkout.stripe.com/pay/cs_test_session_123",
    status: "open",
  },
};

// Testimonial mock data
export const testimonialMockData = {
  id: "1",
  name: "John Smith",
  title: "Senior Software Engineer",
  company: "Tech Corp",
  recommendation: "Excellent developer with great skills.",
  linkedInUrl: "https://linkedin.com/in/johnsmith",
  date: "2024-01-15",
  relationship: "Former Colleague",
  skills: ["React", "TypeScript", "Node.js"],
};

// Profile mock data
export const profileMockData = {
  id: "1",
  firstName: "John",
  lastName: "Smith",
  headline: "Senior Software Engineer at Tech Corp",
  profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  publicProfileUrl: "https://linkedin.com/in/johnsmith",
  industry: "Information Technology",
  summary: "Passionate full-stack developer with expertise in modern web technologies.",
  location: {
    name: "San Francisco, CA",
    country: "United States",
  },
  email: "john.smith@example.com",
};

// User mock data
export const userMockData = {
  id: "2",
  firstName: "Sarah",
  lastName: "Johnson",
  headline: "Product Manager at Startup Inc",
  profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  publicProfileUrl: "https://linkedin.com/in/sarahjohnson",
  industry: "Technology",
  summary: "Experienced product manager with a focus on user experience.",
  location: {
    name: "New York, NY",
    country: "United States",
  },
  email: "sarah.johnson@example.com",
};

// API response mock data
export const apiMockData = {
  github: {
    contributions: githubMockData.contributions,
    activity: githubMockData.activity,
  },
  stripe: stripeMockData,
  testimonials: [testimonialMockData],
  profile: profileMockData,
};

// UI Component mock data
export const uiMockData = {
  testimonials: [
    {
      id: "1",
      recommender: {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        headline: "Senior Software Engineer",
        profilePicture: "https://example.com/john.jpg",
        publicProfileUrl: "https://linkedin.com/in/johnsmith",
      },
      recommendationText:
        "Excellent developer with great problem-solving skills.",
      createdAt: "2024-01-15T00:00:00Z",
      relationship: "Former Colleague",
      skillEndorsements: ["React", "TypeScript"],
      visibility: "PUBLIC",
    },
    {
      id: "2",
      recommender: {
        id: "2",
        firstName: "Sarah",
        lastName: "Johnson",
        headline: "Product Manager",
        profilePicture: "https://example.com/sarah.jpg",
        publicProfileUrl: "https://linkedin.com/in/sarahjohnson",
      },
      recommendationText: "Great team player and excellent communicator.",
      createdAt: "2023-12-20T00:00:00Z",
      relationship: "Client",
      skillEndorsements: ["Communication", "Leadership"],
      visibility: "PUBLIC",
    },
  ],
  projects: [
    {
      id: "1",
      title: "Portfolio Website",
      description: "A modern portfolio website built with Next.js",
      image: "https://example.com/project1.jpg",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/user/portfolio",
      liveUrl: "https://portfolio.example.com",
    },
    {
      id: "2",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution",
      image: "https://example.com/project2.jpg",
      technologies: ["React", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/user/ecommerce",
      liveUrl: "https://ecommerce.example.com",
    },
  ],
  skills: [
    {
      category: "Frontend",
      technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    },
    {
      category: "Backend",
      technologies: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    },
    {
      category: "Tools",
      technologies: ["Git", "Docker", "AWS", "Vercel"],
    },
  ],
};

// Error responses
export const errorResponses = {
  linkedin: {
    unauthorized: {
      error: "Unauthorized",
      status: 401,
      message: "Invalid access token",
    },
    rateLimited: {
      error: "Rate Limited",
      status: 429,
      message: "Too many requests",
    },
    serverError: {
      error: "Internal Server Error",
      status: 500,
      message: "Something went wrong",
    },
  },
  github: {
    notFound: {
      error: "Not Found",
      status: 404,
      message: "User not found",
    },
    unauthorized: {
      error: "Unauthorized",
      status: 401,
      message: "Invalid token",
    },
  },
  stripe: {
    invalidRequest: {
      error: "Invalid Request",
      status: 400,
      message: "Invalid parameters",
    },
    cardError: {
      error: "Card Error",
      status: 402,
      message: "Card declined",
    },
  },
};
