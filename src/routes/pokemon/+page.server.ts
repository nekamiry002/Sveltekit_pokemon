import { pokemonService } from "$lib/services/pokemon";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const [pokemons, apiError] = await pokemonService.getPokemons();

    if (apiError || !pokemons) {
        throw error(500, apiError ?? "Unable to load Pokemons");
    }

    return { pokemons };
};