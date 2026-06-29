<script lang="ts">
	import TypeBadge from './TypeBadge.svelte'
	import { favoritesStore } from '$lib/state/favorites.svelte'
	import { compareStore } from '$lib/state/compare.svelte'
	import { authStore } from '$lib/state/auth.svelte'
	import { favoritesService } from '$lib/services/favorites'
	import { supabase } from '$lib/supabaseClient'

	interface Props {
		id: number
		name: string
		types?: string[]
		loading?: boolean
	}

	let { id, name, types = [], loading = false }: Props = $props()

	const spriteUrl = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
	)
	const artworkUrl = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
	)

	let toggling = $state(false)

	async function toggleFavorite(e: MouseEvent) {
		e.preventDefault()
		if (!authStore.isAuthenticated || toggling) return
		toggling = true

		const { isFavorite, record } = await favoritesService.toggle(
			supabase,
			authStore.user!.id,
			id,
			name
		)

		if (isFavorite && record) {
			favoritesStore.add(record)
		} else {
			favoritesStore.remove(id)
		}
		toggling = false
	}

	function toggleCompare(e: MouseEvent) {
		e.preventDefault()
		compareStore.toggle(id)
	}

	const isFav = $derived(favoritesStore.isFavorite(id))
	const inCompare = $derived(compareStore.has(id))
</script>

<a
	href="/pokemon/{id}"
	class="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden block"
	aria-label="Voir le détail de {name} (#{String(id).padStart(3, '0')})"
>
	<!-- Artwork background hint -->
	<div
		class="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
	></div>

	<div class="relative p-4">
		<!-- Top row: number + action buttons -->
		<div class="flex justify-between items-start mb-2">
			<span class="text-xs font-bold text-gray-400">#{String(id).padStart(3, '0')}</span>
			<div class="flex gap-1">
				<!-- Compare button -->
				<button
					onclick={toggleCompare}
					class="p-1.5 rounded-full transition-colors {inCompare
						? 'bg-yellow-400 text-gray-900'
						: 'bg-gray-100 text-gray-400 hover:bg-gray-200'}"
					title={inCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
					aria-label={inCompare ? 'Retirer de la comparaison' : 'Comparer ce Pokémon'}
					aria-pressed={inCompare}
				>
					<svg
						class="w-3.5 h-3.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</button>

				<!-- Favorite button -->
				{#if authStore.isAuthenticated}
					<button
						onclick={toggleFavorite}
						disabled={toggling}
						class="p-1.5 rounded-full transition-colors {isFav
							? 'bg-red-100 text-red-600'
							: 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'}"
						title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
						aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
						aria-pressed={isFav}
					>
						<svg
							class="w-3.5 h-3.5"
							fill={isFav ? 'currentColor' : 'none'}
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<!-- Sprite -->
		<div class="flex justify-center mb-3">
			{#if loading}
				<div class="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
			{:else}
				<img
					src={artworkUrl}
					alt={name}
					class="w-24 h-24 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
					loading="lazy"
					onerror={(e) => {
						;(e.currentTarget as HTMLImageElement).src = spriteUrl
					}}
				/>
			{/if}
		</div>

		<!-- Name -->
		<h3 class="text-center font-semibold text-gray-800 capitalize mb-2">{name}</h3>

		<!-- Types -->
		{#if types.length > 0}
			<div class="flex justify-center gap-1 flex-wrap">
				{#each types as type}
					<TypeBadge {type} />
				{/each}
			</div>
		{/if}
	</div>
</a>
