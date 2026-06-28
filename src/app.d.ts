import type { SupabaseClient, Session, User } from '@supabase/supabase-js'
import type { Favorite, TeamMember } from '$lib/types/database'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
		}
		interface PageData {
			session: Session | null
			user: User | null
			favorites: Favorite[]
			team: TeamMember[]
		}
	}
}

export {}
