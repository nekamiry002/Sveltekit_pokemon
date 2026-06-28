import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'

declare global {
	var __supabase: ReturnType<typeof createClient> | undefined
}

const getClient = () => {
	if (typeof window !== 'undefined') {
		if (!globalThis.__supabase) {
			globalThis.__supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY)
		}
		return globalThis.__supabase
	}
	return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}

export const supabase = getClient()
