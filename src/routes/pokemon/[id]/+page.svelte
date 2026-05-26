<script>
    let {data} = $props();
</script>

{#if data.pokemon}
<div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
            Pokemon: {data.pokemon.name}
        </h1>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div>
                <h2 class="text-xl font-semibold text-gray-800 capitalize mb-2">
                    {data.pokemon.name}
                </h2>
                <h2>
                    <span class="font-medium text-gray-700">ID:</span> {data.pokemon.id}
                </h2>
            </div>
            <div>
                <h2 class="text-lg font-medium text-gray-700 mb-2">
                    Types: 
                    {#each data.pokemon.types as type}
                        <span class="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full mr-2 capitalize">
                            {type.type.name}
                        </span>
                    {/each}
                </h2>
            </div>
            <div>
                <h2 class="text-lg font-medium text-gray-700 mb-2">
                    Weight: {data.pokemon.weight}
                </h2>
                <h2 class="text-lg font-medium text-gray-700 mb-2">
                    Height: {data.pokemon.height}
                </h2>
            </div>
            <div class="text-lg font-medium text-gray-700 mb-4 ">
                <p> Sprite: </p>
                <img src={data.pokemon.sprites.front_default} alt="${data.pokemon.name} front" class="inline-block w-32 h-32 mx-auto" />
                <img src={data.pokemon.sprites.back_default} alt="${data.pokemon.name} back" class="inline-block w-32 h-32 mx-auto" />
            </div>
        </div>
    </div>
</div>
{/if}