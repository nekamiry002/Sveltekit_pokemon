import type { LayoutServerLoad } from './$types'
import type { Favorite, TeamMember } from '$lib/types/database'

export const load: LayoutServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session, user } = await safeGetSession()

	let favorites: Favorite[] = []
	let team: TeamMember[] = []

	if (user) {
		const [favResult, teamResult] = await Promise.all([
			supabase
				.from('favorites')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false }),
			supabase.from('team_members').select('*').eq('user_id', user.id).order('slot'),
		])
		favorites = favResult.data ?? []
		team = teamResult.data ?? []
	}

	return { session, user, favorites, team }
}
