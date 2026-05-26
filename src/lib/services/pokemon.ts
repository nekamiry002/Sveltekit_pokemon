import { safeFetch } from "$lib/utils/api";
import type { Pokemons, Pokemon } from "$lib/types/pokemon";

export const pokemonService = {
    async getPokemons(): Promise<[Pokemons | null, string | null]> {
        const [data, error] = await safeFetch<Pokemons>("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");

        if (error || !data) {
            return [data, error];
        }

        // Extraire l'ID de l'URL pour chaque Pokémon
        const pokemonsWithId = {
            ...data,
            results: data.results.map(pokemon => ({
                ...pokemon,
                id: extractPokemonId(pokemon.url)
            }))
        };

        return [pokemonsWithId, null];
    },

    async getOnePokemon(id: number){
        return safeFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
    },
};

// Fonction utilitaire pour extraire l'ID de l'URL
function extractPokemonId(url: string): number {
    // URL format: https://pokeapi.co/api/v2/pokemon/1/
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
}