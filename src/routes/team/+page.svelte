<script lang="ts">
	import { teamStore } from '$lib/state/team.svelte'
	import { favoritesStore } from '$lib/state/favorites.svelte'
	import { teamService } from '$lib/services/team'
	import { supabase } from '$lib/supabaseClient'
	import { authStore } from '$lib/state/auth.svelte'
	import { invalidateAll } from '$app/navigation'
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'

	let removing = $state<number | null>(null)
	let error = $state<string | null>(null)

	const SLOTS = [1, 2, 3, 4, 5, 6]

	async function removeMember(pokemonId: number) {
		if (!authStore.user) return
		removing = pokemonId
		error = null
		await teamService.remove(supabase, authStore.user.id, pokemonId)
		teamStore.remove(pokemonId)
		removing = null
		await invalidateAll()
	}

	const artworkUrl = (id: number) =>
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
	const spriteUrl = (id: number) =>
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

	const memberBySlot = $derived(
		new Map(teamStore.members.map((m) => [m.slot, m]))
	)
</script>

<svelte:head>
	<title>Mon équipe — Pokédex</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="flex items-center gap-3 mb-8">
		<span class="text-3xl" aria-hidden="true">🏆</span>
		<div>
			<h1 class="text-3xl font-bold text-gray-800">Mon équipe</h1>
			<p class="text-gray-500 mt-1">{teamStore.members.length}/6 Pokémon</p>
		</div>
	</div>

	{#if error}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
			{error}
		</div>
	{/if}

	<!-- Team slots grid -->
	<div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
		{#each SLOTS as slot}
			{@const member = memberBySlot.get(slot)}
			<div
				class="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg
					{!member ? 'border-2 border-dashed border-gray-200' : ''}"
				role="listitem"
				aria-label="Slot {slot}: {member ? member.pokemon_name : 'vide'}"
			>
				{#if member}
					<div class="p-4 text-center">
						<p class="text-xs font-bold text-gray-400 mb-2">Slot {slot}</p>
						<a href="/pokemon/{member.pokemon_id}">
							<img
								src={artworkUrl(member.pokemon_id)}
								alt={member.pokemon_name}
								class="w-24 h-24 mx-auto object-contain hover:scale-110 transition-transform"
								onerror={(e) => { (e.currentTarget as HTMLImageElement).src = spriteUrl(member.pokemon_id) }}
							/>
						</a>
						<a
							href="/pokemon/{member.pokemon_id}"
							class="block mt-2 font-semibold text-gray-700 capitalize hover:text-red-600 transition-colors"
						>
							{member.pokemon_name}
						</a>
						<p class="text-xs text-gray-400">#{String(member.pokemon_id).padStart(3, '0')}</p>

						<button
							onclick={() => removeMember(member.pokemon_id)}
							disabled={removing === member.pokemon_id}
							class="mt-3 px-3 py-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-lg transition-colors disabled:opacity-50"
							aria-label="Retirer {member.pokemon_name} de l'équipe"
						>
							{removing === member.pokemon_id ? '...' : 'Retirer'}
						</button>
					</div>
				{:else}
					<div class="p-6 text-center text-gray-300">
						<p class="text-sm font-medium">Slot {slot}</p>
						<p class="text-xs mt-1">Vide</p>
						<a
							href="/pokemon"
							class="mt-3 inline-block text-xs text-red-400 hover:text-red-600 underline"
						>
							Ajouter
						</a>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Suggestions from favorites -->
	{#if favoritesStore.items.length > 0}
		{@const suggestions = favoritesStore.items.filter((f) => !teamStore.inTeam(f.pokemon_id)).slice(0, 5)}
		{#if suggestions.length > 0}
			<div>
				<h2 class="text-lg font-semibold text-gray-700 mb-4">Suggestions depuis vos favoris</h2>
				<div class="flex flex-wrap gap-3">
					{#each suggestions as fav}
						<a
							href="/pokemon/{fav.pokemon_id}"
							class="flex items-center gap-2 bg-white rounded-lg shadow-sm px-3 py-2 hover:shadow-md transition-shadow"
						>
							<img
								src={spriteUrl(fav.pokemon_id)}
								alt={fav.pokemon_name}
								class="w-10 h-10 object-contain"
							/>
							<span class="text-sm font-medium text-gray-700 capitalize">{fav.pokemon_name}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{:else if teamStore.members.length === 0}
		<div class="text-center py-8 text-gray-400">
			<p class="mb-4">Explorez le Pokédex et ajoutez des Pokémon à votre équipe depuis leur page de détail !</p>
			<a href="/pokemon" class="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
				Voir le Pokédex
			</a>
		</div>
	{/if}
</div>
