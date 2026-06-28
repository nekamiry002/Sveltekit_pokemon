import type { SupabaseClient } from '@supabase/supabase-js'
import type { Favorite } from '$lib/types/database'

export const favoritesService = {
	async getAll(supabase: SupabaseClient, userId: string): Promise<Favorite[]> {
		const { data } = await supabase
			.from('favorites')
			.select('*')
			.eq('user_id', userId)
			.order('created_at', { ascending: false })
		return data ?? []
	},

	async toggle(
		supabase: SupabaseClient,
		userId: string,
		pokemonId: number,
		pokemonName: string
	): Promise<{ isFavorite: boolean; record: Favorite | null }> {
		const { data: existing } = await supabase
			.from('favorites')
			.select('id')
			.eq('user_id', userId)
			.eq('pokemon_id', pokemonId)
			.maybeSingle()

		if (existing) {
			await supabase.from('favorites').delete().eq('id', existing.id)
			return { isFavorite: false, record: null }
		}

		const { data } = await supabase
			.from('favorites')
			.insert({ user_id: userId, pokemon_id: pokemonId, pokemon_name: pokemonName })
			.select()
			.single()

		return { isFavorite: true, record: data }
	},
}
