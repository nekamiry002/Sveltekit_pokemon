import { createBrowserClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'

type BrowserClient = ReturnType<typeof createBrowserClient>

declare global {
	var __supabase: BrowserClient | undefined
}

const getClient = (): BrowserClient => {
	if (!globalThis.__supabase) {
		globalThis.__supabase = createBrowserClient(
			PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_PUBLISHABLE_KEY
		)
	}
	return globalThis.__supabase
}

export const supabase = getClient()
