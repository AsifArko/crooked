import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Check if GitHub token is configured
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json(
        { 
          error: 'GitHub token not configured',
          message: 'Please configure GITHUB_TOKEN environment variable'
        },
        { status: 500 }
      )
    }

    // GitHub GraphQL query for contributions
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'crooked-app',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error:', response.status, errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid GitHub token' },
          { status: 401 }
        )
      }
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Rate limit exceeded or insufficient permissions' },
          { status: 403 }
        )
      }
      
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      const error = data.errors[0]
      console.error('GraphQL error:', error)
      
      if (error.message.includes('Could not resolve to a User')) {
        return NextResponse.json(
          { error: 'GitHub user not found' },
          { status: 404 }
        )
      }
      
      throw new Error(error.message)
    }

    const user = data.data.user
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Extract contribution days from the response
    const weeks = user.contributionsCollection.contributionCalendar.weeks
    const contributions: Array<{ date: string; contributionCount: number }> = []

    weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributions.push({
          date: day.date,
          contributionCount: day.contributionCount,
        })
      })
    })

    // Sort contributions by date to ensure proper order
    contributions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ 
      contributions,
      totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
      username
    })
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    )
  }
} 