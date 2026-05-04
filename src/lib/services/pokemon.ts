import { safeFetch } from "$lib/utils/api";
import type { Pokemons, Pokemon } from "$lib/types/pokemon";

export const pokemonService = {
    async getPokemons(){
        return safeFetch<Pokemons>("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
    },

    async getOnePokemon(id: number){
        return safeFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
    },
};