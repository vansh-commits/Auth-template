import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
  
    
    const response = await fetch(`${BACKEND_URL}/users/${id}`)

    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[API] Backend error: ${response.status} - ${errorText}`)
      throw new Error(`Backend responded with ${response.status}: ${errorText}`)
    }
    
    const user = await response.json()

    return NextResponse.json(user)
  } catch (error) {
    console.error('[API] Error fetching user:', error)
    return NextResponse.json(
      { error: `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
