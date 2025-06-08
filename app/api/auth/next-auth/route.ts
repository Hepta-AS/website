import { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response('Hello from Next.js API route')
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body = await req.json()
    return new Response(
      JSON.stringify({ success: true, data: body, user: session.user }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Failed to process request: ${error instanceof Error ? error.message : String(error)}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
