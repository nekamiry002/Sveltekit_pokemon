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
            <h2 class="text-xl font-semibold text-gray-800 capitalize mb-2">
                {data.pokemon.name}
            </h2>
            <p class="text-gray-600 text-sm mb-4">
                Sprite: 
                <img src={data.pokemon.sprites.front_default} alt={data.pokemon.name} class="w-32 h-32 mx-auto" />
            </p>
        </div>
    </div>
</div>
{/if}