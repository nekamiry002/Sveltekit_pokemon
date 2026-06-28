export interface PokemonListItem {
	name: string
	url: string
	id: number
}

export interface Pokemons {
	count: number
	next: string | null
	previous: string | null
	results: PokemonListItem[]
}

export interface PokemonStat {
	base_stat: number
	effort: number
	stat: { name: string; url: string }
}

export interface PokemonAbility {
	ability: { name: string; url: string }
	is_hidden: boolean
	slot: number
}

export interface PokemonType {
	slot: number
	type: { name: string; url: string }
}

export interface Pokemon {
	id: number
	name: string
	height: number
	weight: number
	base_experience: number
	sprites: {
		front_default: string
		back_default: string
		front_shiny: string | null
		back_shiny: string | null
		other?: {
			'official-artwork'?: {
				front_default: string | null
			}
		}
	}
	types: PokemonType[]
	stats: PokemonStat[]
	abilities: PokemonAbility[]
}
