import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

interface AuthResponse {
  user?: any
  error?: string
  success?: boolean
  data?: any
}

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json({ user: session.user })
}

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const body = await request.json()
    return NextResponse.json({ 
      success: true, 
      data: body,
      user: session.user 
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to process request: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
