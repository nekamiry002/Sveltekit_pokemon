import type { SupabaseClient } from '@supabase/supabase-js'
import type { Rating } from '$lib/types/database'

export const ratingsService = {
	async getForPokemon(supabase: SupabaseClient, pokemonId: number): Promise<Rating[]> {
		const { data } = await supabase
			.from('ratings')
			.select('*, profiles!ratings_profile_fkey(username)')
			.eq('pokemon_id', pokemonId)
			.order('created_at', { ascending: false })
		return data ?? []
	},

	async getUserRating(
		supabase: SupabaseClient,
		userId: string,
		pokemonId: number
	): Promise<Rating | null> {
		const { data } = await supabase
			.from('ratings')
			.select('*')
			.eq('user_id', userId)
			.eq('pokemon_id', pokemonId)
			.maybeSingle()
		return data
	},

	async upsert(
		supabase: SupabaseClient,
		userId: string,
		pokemonId: number,
		rating: number,
		comment: string
	): Promise<{ success: boolean; error: string | null }> {
		const { error } = await supabase.from('ratings').upsert(
			{ user_id: userId, pokemon_id: pokemonId, rating, comment },
			{ onConflict: 'user_id,pokemon_id' }
		)
		if (error) return { success: false, error: error.message }
		return { success: true, error: null }
	},

	async delete(
		supabase: SupabaseClient,
		userId: string,
		pokemonId: number
	): Promise<void> {
		await supabase
			.from('ratings')
			.delete()
			.eq('user_id', userId)
			.eq('pokemon_id', pokemonId)
	},

	averageRating(ratings: Rating[]): number {
		if (ratings.length === 0) return 0
		return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
	},
}
