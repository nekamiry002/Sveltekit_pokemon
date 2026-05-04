<script>
    let {data} = $props();
</script>

{#if data.pokemons}
<div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
            Pokemons ({data.pokemons.results.length})
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each data.pokemons.results as pokemon}
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <h2 class="text-xl font-semibold text-gray-800 capitalize mb-2">
                        {pokemon.name}
                    </h2>
                    <p class="text-gray-600 text-sm mb-4">
                        URL: {pokemon.url}
                    </p>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                        View Details
                    </button>
                </div>
            {/each}
        </div>
    </div>
</div>
{/if}