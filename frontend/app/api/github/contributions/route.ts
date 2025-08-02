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
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data')
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(data.errors[0].message)
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

    return NextResponse.json({ contributions })
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    )
  }
} 