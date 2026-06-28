<script lang="ts">
	import PokemonCard from '$lib/components/PokemonCard.svelte'
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte'
	import { compareStore } from '$lib/state/compare.svelte'
	import { goto } from '$app/navigation'
	import type { Pokemons } from '$lib/types/pokemon'

	let { data }: { data: { pokemons: Pokemons } } = $props()

	// Search & filter state
	let search = $state('')
	let selectedType = $state('')
	let sortBy = $state<'id' | 'name'>('id')
	let typeFilterLoading = $state(false)
	let typeFilteredIds = $state<Set<number> | null>(null)

	const TYPES = [
		'normal','fire','water','electric','grass','ice',
		'fighting','poison','ground','flying','psychic','bug',
		'rock','ghost','dragon','dark','steel','fairy',
	]

	// Load Pokémon IDs by type from PokeAPI
	async function fetchTypeFilter(type: string) {
		if (!type) {
			typeFilteredIds = null
			return
		}
		typeFilterLoading = true
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
			if (!res.ok) throw new Error('Type fetch failed')
			const json: { pokemon: Array<{ pokemon: { url: string } }> } = await res.json()
			const ids = new Set(
				json.pokemon
					.map((p) => {
						const m = p.pokemon.url.match(/\/pokemon\/(\d+)\//)
						return m ? parseInt(m[1]) : 0
					})
					.filter((id) => id >= 1 && id <= 151)
			)
			typeFilteredIds = ids
		} catch {
			typeFilteredIds = null
		} finally {
			typeFilterLoading = false
		}
	}

	$effect(() => {
		fetchTypeFilter(selectedType)
	})

	// Filtered + sorted list
	const filtered = $derived(
		data.pokemons.results
			.filter((p) => {
				const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
					String(p.id).includes(search)
				const matchesType = typeFilteredIds === null || typeFilteredIds.has(p.id)
				return matchesSearch && matchesType
			})
			.sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : a.id - b.id)
	)

	// Pagination
	let page = $state(1)
	const PER_PAGE = 20
	const totalPages = $derived(Math.ceil(filtered.length / PER_PAGE))
	const paginatedList = $derived(filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE))

	$effect(() => {
		// Reset page when filter changes
		search; selectedType; sortBy
		page = 1
	})

	function goCompare() {
		goto(`/compare?ids=${compareStore.toQueryString()}`)
	}
</script>

<svelte:head>
	<title>Pokédex — Les 151 premiers Pokémon</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Title -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-800">Pokédex</h1>
			<p class="text-gray-500 mt-1">Les 151 premiers Pokémon</p>
		</div>
		{#if compareStore.ids.length > 0}
			<button
				onclick={goCompare}
				class="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-lg transition-colors flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
				</svg>
				Comparer ({compareStore.ids.length})
			</button>
		{/if}
	</div>

	<!-- Filters bar -->
	<div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
		<!-- Search -->
		<div class="flex-1 relative">
			<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<input
				type="search"
				placeholder="Rechercher par nom ou numéro..."
				bind:value={search}
				class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
				aria-label="Rechercher un Pokémon"
			/>
		</div>

		<!-- Type filter -->
		<div class="relative">
			{#if typeFilterLoading}
				<div class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
			{/if}
			<select
				bind:value={selectedType}
				class="pr-8 pl-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white appearance-none"
				aria-label="Filtrer par type"
			>
				<option value="">Tous les types</option>
				{#each TYPES as type}
					<option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
				{/each}
			</select>
		</div>

		<!-- Sort -->
		<select
			bind:value={sortBy}
			class="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
			aria-label="Trier par"
		>
			<option value="id">Trier par N°</option>
			<option value="name">Trier par nom</option>
		</select>
	</div>

	<!-- Results count -->
	<p class="text-sm text-gray-500 mb-4" aria-live="polite">
		{#if typeFilterLoading}
			Filtrage en cours...
		{:else}
			{filtered.length} Pokémon trouvé{filtered.length > 1 ? 's' : ''}
		{/if}
	</p>

	<!-- Grid -->
	{#if typeFilterLoading}
		<LoadingSpinner message="Chargement du filtre par type..." />
	{:else if paginatedList.length === 0}
		<div class="text-center py-16 text-gray-400">
			<div class="text-5xl mb-4" aria-hidden="true">🔍</div>
			<p class="text-lg font-medium">Aucun Pokémon trouvé</p>
			<p class="text-sm mt-1">Essayez de modifier votre recherche ou vos filtres</p>
			<button
				onclick={() => { search = ''; selectedType = ''; sortBy = 'id' }}
				class="mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-700 underline"
			>
				Réinitialiser les filtres
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
			{#each paginatedList as pokemon (pokemon.id)}
				<PokemonCard id={pokemon.id} name={pokemon.name} />
			{/each}
		</div>
	{/if}

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex items-center justify-center gap-2 mt-8" role="navigation" aria-label="Pagination">
			<button
				onclick={() => page = Math.max(1, page - 1)}
				disabled={page === 1}
				class="px-3 py-2 border rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
				aria-label="Page précédente"
			>
				←
			</button>

			{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
				{#if p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)}
					<button
						onclick={() => page = p}
						class="w-9 h-9 rounded-lg text-sm font-medium transition-colors
							{p === page ? 'bg-red-600 text-white' : 'border hover:bg-gray-50 text-gray-700'}"
						aria-label="Page {p}"
						aria-current={p === page ? 'page' : undefined}
					>
						{p}
					</button>
				{:else if p === page - 2 || p === page + 2}
					<span class="text-gray-400">…</span>
				{/if}
			{/each}

			<button
				onclick={() => page = Math.min(totalPages, page + 1)}
				disabled={page === totalPages}
				class="px-3 py-2 border rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
				aria-label="Page suivante"
			>
				→
			</button>
		</div>
	{/if}
</div>
