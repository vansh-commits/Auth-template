import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080'

export async function GET() {
  try {
 
    
    const response = await fetch(`${BACKEND_URL}/users/bulk`)

    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[API] Backend error: ${response.status} - ${errorText}`)
      throw new Error(`Backend responded with ${response.status}: ${errorText}`)
    }
    
    const users = await response.json()
   
    return NextResponse.json(users)
  } catch (error) {
    console.error('[API] Error fetching users:', error)
    return NextResponse.json(
      { error: `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
