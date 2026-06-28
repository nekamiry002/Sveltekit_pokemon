<script lang="ts">
	import PokemonCard from '$lib/components/PokemonCard.svelte'
	import { favoritesStore } from '$lib/state/favorites.svelte'

	const sorted = $derived(
		[...favoritesStore.items].sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		)
	)
</script>

<svelte:head>
	<title>Mes favoris — Pokédex</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<div class="flex items-center gap-3 mb-8">
		<span class="text-3xl text-red-500" aria-hidden="true">♥</span>
		<div>
			<h1 class="text-3xl font-bold text-gray-800">Mes favoris</h1>
			<p class="text-gray-500 mt-1">{sorted.length} Pokémon favori{sorted.length > 1 ? 's' : ''}</p>
		</div>
	</div>

	{#if sorted.length === 0}
		<div class="text-center py-20">
			<div class="text-6xl mb-4" aria-hidden="true">♡</div>
			<h2 class="text-xl font-semibold text-gray-600 mb-2">Aucun favori pour l'instant</h2>
			<p class="text-gray-400 mb-6">Explorez le Pokédex et ajoutez vos Pokémon préférés !</p>
			<a
				href="/pokemon"
				class="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
			>
				Voir le Pokédex
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{#each sorted as fav (fav.id)}
				<PokemonCard id={fav.pokemon_id} name={fav.pokemon_name} />
			{/each}
		</div>
	{/if}
</div>
