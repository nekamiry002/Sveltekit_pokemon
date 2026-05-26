import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { env } from '$env/dynamic/private'

export const POST: RequestHandler = async ({ request }) => {
  const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
  if (!SERVICE_ROLE_KEY) {
    return json({ error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 })
  }

  const admin = createClient(PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY)

  const { email, password } = await request.json()

  if (!email || !password) {
    return json({ error: 'Email and password required' }, { status: 400 })
  }

  // Create user via the Admin API (service role key required)
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    return json({ error: error.message }, { status: 400 })
  }

  return json({ user: data }, { status: 201 })
}
