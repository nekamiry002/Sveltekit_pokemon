<script lang="ts">
    import type { Pokemons } from "$lib/types/pokemon";

    let { data }: { data: { pokemons: Pokemons } } = $props();
    let page = $state(1);
    //console.log('Pokemons data:', data.pokemons);
</script>

{#if data.pokemons && typeof data.pokemons !== 'string'}
<div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
            Pokemons ({data.pokemons.results.length})
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.pokemons.results.slice((page - 1) * 10, page * 10) as pokemon}
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <h2 class="text-xl font-semibold text-gray-800 capitalize mb-2">
                        {pokemon.name}
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">
                        URL: {pokemon.url}
                    </p>
                    <a href={`/pokemon/${pokemon.id}`}>
                        <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                            View Details
                        </button>
                    </a>
                </div>
            {/each}
            <button
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors duration-200"
                onclick={() => page = Math.max(page - 1, 1)}
                disabled={page === 1}
            >
                Previous
            </button>
            <button
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors duration-200"
                onclick={() => page = Math.min(page + 1, Math.ceil(data.pokemons.results.length / 10))}
                disabled={page === Math.ceil(data.pokemons.results.length / 10)}
            >
                Next
            </button>
        </div>
    </div>
</div>
{/if}