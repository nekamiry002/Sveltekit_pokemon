<script lang="ts">
	import TypeBadge from '$lib/components/TypeBadge.svelte'
	import { compareStore } from '$lib/state/compare.svelte'
	import type { Pokemon } from '$lib/types/pokemon'

	let { data }: { data: { pokemons: Pokemon[]; ids: number[] } } = $props()

	const STAT_LABELS: Record<string, string> = {
		hp: 'PV',
		attack: 'Attaque',
		defense: 'Défense',
		'special-attack': 'Att. Spé.',
		'special-defense': 'Déf. Spé.',
		speed: 'Vitesse',
	}

	const artworkUrl = (id: number) =>
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
	const spriteUrl = (id: number) =>
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

	function bestStat(statName: string): number {
		const vals = data.pokemons.map(
			(p) => p.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0
		)
		return Math.max(...vals)
	}
</script>

<svelte:head>
	<title>Comparer des Pokémon — Pokédex</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-800">Comparaison</h1>
			<p class="text-gray-500 mt-1">Comparez les statistiques de vos Pokémon</p>
		</div>
		<div class="flex gap-3">
			<a href="/pokemon" class="px-4 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
				← Retour
			</a>
			{#if data.pokemons.length > 0}
				<button
					onclick={() => compareStore.clear()}
					class="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
				>
					Réinitialiser
				</button>
			{/if}
		</div>
	</div>

	{#if data.pokemons.length < 2}
		<div class="text-center py-20">
			<div class="text-5xl mb-4" aria-hidden="true">⊞</div>
			<h2 class="text-xl font-semibold text-gray-600 mb-2">Sélectionnez au moins 2 Pokémon</h2>
			<p class="text-gray-400 mb-6">
				Utilisez le bouton "Comparer" sur les cartes Pokémon pour en sélectionner jusqu'à 3.
			</p>
			<a
				href="/pokemon"
				class="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
			>
				Voir le Pokédex
			</a>
		</div>
	{:else}
		<!-- Pokemon header row -->
		<div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
			<div class="grid gap-px bg-gray-100" style="grid-template-columns: 160px repeat({data.pokemons.length}, 1fr)">
				<div class="bg-gray-50 p-4"></div>
				{#each data.pokemons as pokemon}
					<div class="bg-white p-4 text-center">
						<img
							src={artworkUrl(pokemon.id)}
							alt={pokemon.name}
							class="w-28 h-28 mx-auto object-contain"
							onerror={(e) => { (e.currentTarget as HTMLImageElement).src = spriteUrl(pokemon.id) }}
						/>
						<p class="text-xs text-gray-400 font-bold mt-1">#{String(pokemon.id).padStart(3, '0')}</p>
						<a
							href="/pokemon/{pokemon.id}"
							class="block font-bold text-gray-800 capitalize hover:text-red-600 transition-colors mt-1"
						>
							{pokemon.name}
						</a>
						<div class="flex justify-center gap-1 mt-2 flex-wrap">
							{#each pokemon.types as t}
								<TypeBadge type={t.type.name} />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Info comparison -->
		<div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
			<div class="bg-gray-50 px-4 py-3 border-b">
				<h2 class="font-semibold text-gray-700">Informations générales</h2>
			</div>
			{#each [
				{ label: 'Taille', fn: (p: Pokemon) => `${(p.height * 0.1).toFixed(1)} m` },
				{ label: 'Poids', fn: (p: Pokemon) => `${(p.weight * 0.1).toFixed(1)} kg` },
				{ label: 'Exp. de base', fn: (p: Pokemon) => `${p.base_experience}` },
			] as row}
				<div class="grid gap-px bg-gray-100 border-b last:border-0" style="grid-template-columns: 160px repeat({data.pokemons.length}, 1fr)">
					<div class="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">{row.label}</div>
					{#each data.pokemons as pokemon}
						<div class="bg-white px-4 py-3 text-sm text-center text-gray-700">{row.fn(pokemon)}</div>
					{/each}
				</div>
			{/each}
		</div>

		<!-- Stats comparison -->
		<div class="bg-white rounded-xl shadow-md overflow-hidden">
			<div class="bg-gray-50 px-4 py-3 border-b">
				<h2 class="font-semibold text-gray-700">Statistiques de base</h2>
			</div>

			{#each ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'] as statName}
				{@const best = bestStat(statName)}
				<div
					class="grid gap-px bg-gray-100 border-b last:border-0"
					style="grid-template-columns: 160px repeat({data.pokemons.length}, 1fr)"
				>
					<div class="bg-gray-50 px-4 py-4 text-sm font-medium text-gray-600">
						{STAT_LABELS[statName] ?? statName}
					</div>
					{#each data.pokemons as pokemon}
						{@const val = pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0}
						{@const isBest = val === best && data.pokemons.length > 1}
						<div class="bg-white px-4 py-4">
							<div class="flex items-center gap-2">
								<span
									class="text-sm font-bold w-8 text-center {isBest ? 'text-green-600' : 'text-gray-700'}"
									aria-label="{STAT_LABELS[statName] ?? statName}: {val}{isBest ? ' (meilleur)' : ''}"
								>
									{val}
								</span>
								<div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" role="presentation">
									<div
										class="h-full rounded-full transition-all duration-500
											{isBest ? 'bg-green-500' : 'bg-red-400'}"
										style="width: {Math.round((val / 255) * 100)}%"
									></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/each}

			<!-- Total -->
			<div
				class="grid gap-px bg-gray-100 font-semibold"
				style="grid-template-columns: 160px repeat({data.pokemons.length}, 1fr)"
			>
				<div class="bg-gray-100 px-4 py-3 text-sm text-gray-700">Total</div>
				{#each data.pokemons as pokemon}
					{@const total = pokemon.stats.reduce((s, r) => s + r.base_stat, 0)}
					<div class="bg-gray-50 px-4 py-3 text-sm text-center text-gray-800">{total}</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
