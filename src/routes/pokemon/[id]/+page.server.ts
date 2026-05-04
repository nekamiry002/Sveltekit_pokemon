import { pokemonService } from "$lib/services/pokemon";
import { error, fail} from "@sveltejs/kit";

export const load = async ({ params }) => {
    const [pokemon, apiError] = await pokemonService.getOnePokemon(Number(params.id));

    if(apiError){
        throw error(500, apiError);
    }

    return { pokemon };
}