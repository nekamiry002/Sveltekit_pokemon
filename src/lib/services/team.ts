import type { SupabaseClient } from '@supabase/supabase-js'
import type { TeamMember } from '$lib/types/database'

export const teamService = {
	async getAll(supabase: SupabaseClient, userId: string): Promise<TeamMember[]> {
		const { data } = await supabase
			.from('team_members')
			.select('*')
			.eq('user_id', userId)
			.order('slot')
		return data ?? []
	},

	async add(
		supabase: SupabaseClient,
		userId: string,
		pokemonId: number,
		pokemonName: string
	): Promise<{ success: boolean; record: TeamMember | null; error: string | null }> {
		const { data: existing, count } = await supabase
			.from('team_members')
			.select('id', { count: 'exact' })
			.eq('user_id', userId)

		if ((count ?? 0) >= 6) {
			return { success: false, record: null, error: "L'équipe est complète (6 Pokémon max)" }
		}

		if (existing?.some((m) => m.id)) {
			const { data: inTeam } = await supabase
				.from('team_members')
				.select('id')
				.eq('user_id', userId)
				.eq('pokemon_id', pokemonId)
				.maybeSingle()

			if (inTeam) {
				return { success: false, record: null, error: 'Ce Pokémon est déjà dans ton équipe' }
			}
		}

		const occupiedSlots = await supabase
			.from('team_members')
			.select('slot')
			.eq('user_id', userId)
		const taken = new Set((occupiedSlots.data ?? []).map((r: { slot: number }) => r.slot))
		const slot = [1, 2, 3, 4, 5, 6].find((s) => !taken.has(s)) ?? 1

		const { data, error } = await supabase
			.from('team_members')
			.insert({ user_id: userId, pokemon_id: pokemonId, pokemon_name: pokemonName, slot })
			.select()
			.single()

		if (error) return { success: false, record: null, error: error.message }
		return { success: true, record: data, error: null }
	},

	async remove(supabase: SupabaseClient, userId: string, pokemonId: number): Promise<void> {
		await supabase
			.from('team_members')
			.delete()
			.eq('user_id', userId)
			.eq('pokemon_id', pokemonId)
	},
}
