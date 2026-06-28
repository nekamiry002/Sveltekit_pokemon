import { pokemonService } from '$lib/services/pokemon'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Pokemon } from '$lib/types/pokemon'

export const load: PageServerLoad = async ({ url }) => {
	const idsParam = url.searchParams.get('ids') ?? ''
	const ids = idsParam
		.split(',')
		.map(Number)
		.filter((n) => n >= 1 && n <= 151)
		.slice(0, 3)

	if (ids.length < 2) {
		return { pokemons: [] as Pokemon[], ids }
	}

	const results = await Promise.all(ids.map((id) => pokemonService.getOnePokemon(id)))
	const pokemons: Pokemon[] = []

	for (const [pokemon, apiError] of results) {
		if (apiError || !pokemon) throw error(500, apiError ?? 'Pokémon introuvable')
		pokemons.push(pokemon)
	}

	return { pokemons, ids }
}
