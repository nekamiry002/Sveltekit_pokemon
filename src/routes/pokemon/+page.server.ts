import { pokemonService } from "$lib/services/pokemon";
import { error, fail} from "@sveltejs/kit";

export const load = async () => {
    const [pokemons, apiError] = await pokemonService.getPokemons();

    if(apiError){
        throw error(500, apiError);
    }

    return { pokemons };
}