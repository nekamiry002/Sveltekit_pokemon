import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public"

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

declare global {
	// allow global __supabase for dev hot reload
	var __supabase: any | undefined
}

const getClient = () => {
	if (typeof window !== 'undefined') {
		if (!globalThis.__supabase) {
			globalThis.__supabase = createClient(supabaseUrl, supabaseKey)
		}
		return globalThis.__supabase
	}

	// server
	return createClient(supabaseUrl, supabaseKey)
}

export const supabase = getClient()