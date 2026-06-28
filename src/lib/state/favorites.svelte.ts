import type { Favorite } from '$lib/types/database'

class FavoritesState {
	items = $state<Favorite[]>([])
	loaded = $state(false)

	set(data: Favorite[]) {
		this.items = data
		this.loaded = true
	}

	isFavorite(pokemonId: number): boolean {
		return this.items.some((f) => f.pokemon_id === pokemonId)
	}

	add(favorite: Favorite) {
		this.items = [...this.items, favorite]
	}

	remove(pokemonId: number) {
		this.items = this.items.filter((f) => f.pokemon_id !== pokemonId)
	}

	clear() {
		this.items = []
		this.loaded = false
	}
}

export const favoritesStore = new FavoritesState()
