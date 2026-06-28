import { pokemonService } from '$lib/services/pokemon'
import { ratingsService } from '$lib/services/ratings'
import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
	const pokemonId = Number(params.id)

	const [pokemon, apiError] = await pokemonService.getOnePokemon(pokemonId)
	if (apiError || !pokemon) throw error(500, apiError ?? 'Pokémon introuvable')

	const { user } = await safeGetSession()
	const ratings = await ratingsService.getForPokemon(supabase, pokemonId)

	let isFavorite = false
	let inTeam = false
	let userRating = null

	if (user) {
		const [favResult, teamResult, userRatingResult] = await Promise.all([
			supabase
				.from('favorites')
				.select('id')
				.eq('user_id', user.id)
				.eq('pokemon_id', pokemonId)
				.maybeSingle(),
			supabase
				.from('team_members')
				.select('id')
				.eq('user_id', user.id)
				.eq('pokemon_id', pokemonId)
				.maybeSingle(),
			ratingsService.getUserRating(supabase, user.id, pokemonId),
		])
		isFavorite = !!favResult.data
		inTeam = !!teamResult.data
		userRating = userRatingResult
	}

	return { pokemon, ratings, isFavorite, inTeam, userRating, user }
}

export const actions: Actions = {
	toggleFavorite: async ({ params, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { error: 'Connectez-vous pour gérer vos favoris' })

		const pokemonId = Number(params.id)
		const { data: existing } = await supabase
			.from('favorites')
			.select('id')
			.eq('user_id', user.id)
			.eq('pokemon_id', pokemonId)
			.maybeSingle()

		if (existing) {
			await supabase.from('favorites').delete().eq('id', existing.id)
			return { isFavorite: false, pokemonId }
		}

		const [pokemon] = await pokemonService.getOnePokemon(pokemonId)
		const { data: newFav } = await supabase
			.from('favorites')
			.insert({
				user_id: user.id,
				pokemon_id: pokemonId,
				pokemon_name: pokemon?.name ?? `pokemon-${pokemonId}`,
			})
			.select()
			.single()

		return { isFavorite: true, pokemonId, favorite: newFav }
	},

	toggleTeam: async ({ params, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { error: 'Connectez-vous pour gérer votre équipe' })

		const pokemonId = Number(params.id)
		const { data: existing } = await supabase
			.from('team_members')
			.select('id')
			.eq('user_id', user.id)
			.eq('pokemon_id', pokemonId)
			.maybeSingle()

		if (existing) {
			await supabase.from('team_members').delete().eq('id', existing.id)
			return { inTeam: false }
		}

		const { count } = await supabase
			.from('team_members')
			.select('id', { count: 'exact', head: true })
			.eq('user_id', user.id)

		if ((count ?? 0) >= 6) {
			return fail(400, { error: "L'équipe est complète (6 Pokémon max)" })
		}

		const { data: slots } = await supabase
			.from('team_members')
			.select('slot')
			.eq('user_id', user.id)

		const taken = new Set((slots ?? []).map((r: { slot: number }) => r.slot))
		const slot = [1, 2, 3, 4, 5, 6].find((s) => !taken.has(s)) ?? 1

		const [pokemon] = await pokemonService.getOnePokemon(pokemonId)
		await supabase.from('team_members').insert({
			user_id: user.id,
			pokemon_id: pokemonId,
			pokemon_name: pokemon?.name ?? `pokemon-${pokemonId}`,
			slot,
		})
		return { inTeam: true }
	},

	rate: async ({ request, params, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { error: 'Connectez-vous pour laisser un avis' })

		const formData = await request.formData()
		const rating = Number(formData.get('rating'))
		const comment = (formData.get('comment') as string) ?? ''

		if (!rating || rating < 1 || rating > 5) {
			return fail(400, { error: 'Note invalide (1 à 5)' })
		}

		const { success, error: ratingError } = await ratingsService.upsert(
			supabase,
			user.id,
			Number(params.id),
			rating,
			comment
		)

		if (!success) return fail(400, { error: ratingError })
		return { ratingSuccess: true }
	},

	deleteRating: async ({ params, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { error: 'Non authentifié' })

		await ratingsService.delete(supabase, user.id, Number(params.id))
		return { ratingDeleted: true }
	},
}
