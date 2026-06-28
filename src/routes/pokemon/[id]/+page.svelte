<script lang="ts">
	import { enhance } from '$app/forms'
	import TypeBadge from '$lib/components/TypeBadge.svelte'
	import { favoritesStore } from '$lib/state/favorites.svelte'
	import { teamStore } from '$lib/state/team.svelte'
	import { compareStore } from '$lib/state/compare.svelte'
	import { invalidateAll } from '$app/navigation'

	let { data, form } = $props()

	let favoriteLoading = $state(false)
	let teamLoading = $state(false)
	let ratingLoading = $state(false)
	let userRating = $state(0)
	let userComment = $state('')
	let showRatingForm = $state(true)

	$effect(() => {
		userRating = data.userRating?.rating ?? 0
		userComment = data.userRating?.comment ?? ''
		showRatingForm = !data.userRating
	})

	const pokemon = $derived(data.pokemon)
	const artworkUrl = $derived(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.pokemon.id}.png`)

	const isFav = $derived(favoritesStore.isFavorite(pokemon.id))
	const inTeam = $derived(teamStore.inTeam(pokemon.id))
	const inCompare = $derived(compareStore.has(pokemon.id))

	const avgRating = $derived(
		data.ratings.length > 0
			? data.ratings.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / data.ratings.length
			: 0
	)

	const statMax: Record<string, number> = {
		hp: 255, attack: 190, defense: 230, 'special-attack': 194,
		'special-defense': 230, speed: 200,
	}
</script>

<svelte:head>
	<title>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} — Pokédex</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<!-- Back link -->
	<a href="/pokemon" class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		Retour au Pokédex
	</a>

	<!-- Error from form actions -->
	{#if form?.error}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
			{form.error}
		</div>
	{/if}

	<div class="grid md:grid-cols-2 gap-8">
		<!-- Left: artwork + identity -->
		<div>
			<div class="bg-white rounded-2xl shadow-md p-6 text-center">
				<span class="text-sm font-bold text-gray-400">#{String(pokemon.id).padStart(3, '0')}</span>
				<img
					src={artworkUrl}
					alt={pokemon.name}
					class="w-48 h-48 mx-auto object-contain drop-shadow-lg my-4"
					onerror={(e) => { (e.currentTarget as HTMLImageElement).src = pokemon.sprites.front_default }}
				/>
				<h1 class="text-3xl font-bold text-gray-800 capitalize mb-3">{pokemon.name}</h1>
				<div class="flex justify-center gap-2 mb-4">
					{#each pokemon.types as t}
						<TypeBadge type={t.type.name} />
					{/each}
				</div>

				<!-- Quick info -->
				<div class="grid grid-cols-2 gap-3 text-sm mt-4">
					<div class="bg-gray-50 rounded-lg p-3">
						<p class="text-gray-400 text-xs">Taille</p>
						<p class="font-semibold text-gray-700">{(pokemon.height * 0.1).toFixed(1)} m</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-3">
						<p class="text-gray-400 text-xs">Poids</p>
						<p class="font-semibold text-gray-700">{(pokemon.weight * 0.1).toFixed(1)} kg</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-3 col-span-2">
						<p class="text-gray-400 text-xs">Expérience de base</p>
						<p class="font-semibold text-gray-700">{pokemon.base_experience} XP</p>
					</div>
				</div>

				<!-- Abilities -->
				<div class="mt-4 text-left">
					<p class="text-xs text-gray-400 mb-2">Capacités</p>
					<div class="flex flex-wrap gap-2">
						{#each pokemon.abilities as a}
							<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
								{a.ability.name.replace('-', ' ')}
								{#if a.is_hidden}<span class="text-gray-400"> (cachée)</span>{/if}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Sprites row -->
			<div class="mt-4 bg-white rounded-xl shadow-sm p-4 flex justify-center gap-6">
				<div class="text-center">
					<img src={pokemon.sprites.front_default} alt="{pokemon.name} face" class="w-16 h-16" />
					<p class="text-xs text-gray-400">Normal</p>
				</div>
				{#if pokemon.sprites.back_default}
					<div class="text-center">
						<img src={pokemon.sprites.back_default} alt="{pokemon.name} dos" class="w-16 h-16" />
						<p class="text-xs text-gray-400">Dos</p>
					</div>
				{/if}
				{#if pokemon.sprites.front_shiny}
					<div class="text-center">
						<img src={pokemon.sprites.front_shiny} alt="{pokemon.name} shiny" class="w-16 h-16" />
						<p class="text-xs text-yellow-600">✨ Shiny</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right: stats + actions -->
		<div class="flex flex-col gap-6">
			<!-- Action buttons -->
			<div class="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3">
				<!-- Favorite -->
				{#if data.user}
					<form
						method="POST"
						action="?/toggleFavorite"
						use:enhance={() => {
							favoriteLoading = true
							return async ({ result, update }) => {
								if (result.type === 'success' && result.data) {
									const d = result.data as { isFavorite?: boolean }
									if (d.isFavorite === false) {
										favoritesStore.remove(pokemon.id)
									}
								}
								favoriteLoading = false
								await update({ invalidateAll: false })
							}
						}}
					>
						<button
							type="submit"
							disabled={favoriteLoading}
							class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
								{isFav
									? 'bg-red-100 text-red-600 hover:bg-red-200'
									: 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'}"
							aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
							aria-pressed={isFav}
						>
							<svg class="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
							{favoriteLoading ? '...' : isFav ? 'Favori' : 'Ajouter aux favoris'}
						</button>
					</form>

					<!-- Team -->
					<form
						method="POST"
						action="?/toggleTeam"
						use:enhance={() => {
							teamLoading = true
							return async ({ update }) => {
								teamLoading = false
								await invalidateAll()
								await update({ invalidateAll: false })
							}
						}}
					>
						<button
							type="submit"
							disabled={teamLoading || (!inTeam && teamStore.isFull)}
							class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
								{inTeam
									? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
									: teamStore.isFull
									? 'bg-gray-100 text-gray-400 cursor-not-allowed'
									: 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'}"
							aria-label={inTeam ? "Retirer de l'équipe" : "Ajouter à l'équipe"}
							aria-pressed={inTeam}
						>
							🏆 {teamLoading ? '...' : inTeam ? "Dans l'équipe" : teamStore.isFull ? 'Équipe complète' : "Ajouter à l'équipe"}
						</button>
					</form>
				{:else}
					<a href="/login" class="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200">
						Connectez-vous pour ajouter aux favoris
					</a>
				{/if}

				<!-- Compare -->
				<button
					onclick={() => compareStore.toggle(pokemon.id)}
					class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
						{inCompare
							? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
							: 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}"
					aria-label={inCompare ? 'Retirer de la comparaison' : 'Comparer ce Pokémon'}
					aria-pressed={inCompare}
				>
					{inCompare ? '✓ En comparaison' : '⊞ Comparer'}
				</button>
			</div>

			<!-- Stats -->
			<div class="bg-white rounded-xl shadow-md p-6">
				<h2 class="text-lg font-semibold text-gray-800 mb-4">Statistiques de base</h2>
				<div class="space-y-3">
					{#each pokemon.stats as stat}
						{@const max = statMax[stat.stat.name] ?? 200}
						{@const pct = Math.round((stat.base_stat / max) * 100)}
						<div>
							<div class="flex justify-between text-sm mb-1">
								<span class="text-gray-500 capitalize">{stat.stat.name.replace('-', ' ')}</span>
								<span class="font-semibold text-gray-700">{stat.base_stat}</span>
							</div>
							<div class="h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={stat.base_stat} aria-valuemin={0} aria-valuemax={max}>
								<div
									class="h-full rounded-full transition-all duration-500
										{pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}"
									style="width: {pct}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Average rating -->
			{#if data.ratings.length > 0}
				<div class="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
					<div class="text-center">
						<p class="text-3xl font-bold text-gray-800">{avgRating.toFixed(1)}</p>
						<div class="flex gap-0.5 mt-1" aria-label="Note moyenne: {avgRating.toFixed(1)} sur 5">
							{#each [1, 2, 3, 4, 5] as star}
								<span class="text-lg {star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}" aria-hidden="true">★</span>
							{/each}
						</div>
					</div>
					<div class="text-sm text-gray-500">
						{data.ratings.length} avis
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Ratings section -->
	<div class="mt-10">
		<h2 class="text-2xl font-bold text-gray-800 mb-6">Avis de la communauté</h2>

		<!-- Rate form -->
		{#if data.user}
			<div class="bg-white rounded-xl shadow-md p-6 mb-6">
				{#if data.userRating && !showRatingForm}
					<div class="flex items-center justify-between mb-4">
						<p class="font-medium text-gray-700">Mon avis</p>
						<button
							onclick={() => (showRatingForm = true)}
							class="text-sm text-red-600 hover:text-red-700"
						>
							Modifier
						</button>
					</div>
					<div class="flex gap-1 mb-2" aria-label="Ma note: {data.userRating.rating} sur 5">
						{#each [1, 2, 3, 4, 5] as star}
							<span class="text-xl {star <= data.userRating.rating ? 'text-yellow-400' : 'text-gray-200'}" aria-hidden="true">★</span>
						{/each}
					</div>
					{#if data.userRating.comment}
						<p class="text-gray-600 text-sm">{data.userRating.comment}</p>
					{/if}
					<form method="POST" action="?/deleteRating" class="mt-3">
						<button type="submit" class="text-xs text-gray-400 hover:text-red-500">
							Supprimer mon avis
						</button>
					</form>
				{:else}
					<h3 class="font-semibold text-gray-800 mb-4">{data.userRating ? 'Modifier mon avis' : 'Laisser un avis'}</h3>

					{#if form?.ratingSuccess}
						<div class="mb-3 p-2 bg-green-50 text-green-700 rounded-lg text-sm" role="alert">Avis sauvegardé !</div>
					{/if}

					<form
						method="POST"
						action="?/rate"
						use:enhance={() => {
							ratingLoading = true
							return async ({ update }) => {
								ratingLoading = false
								showRatingForm = false
								await update()
							}
						}}
					>
						<!-- Stars selector -->
						<fieldset class="mb-4">
							<legend class="text-sm font-medium text-gray-700 mb-2">Note</legend>
							<div class="flex gap-2" role="group" aria-label="Choisir une note de 1 à 5 étoiles">
								{#each [1, 2, 3, 4, 5] as star}
									<label class="cursor-pointer">
										<input
											type="radio"
											name="rating"
											value={star}
											class="sr-only"
											onchange={() => (userRating = star)}
											checked={userRating === star}
											aria-label="{star} étoile{star > 1 ? 's' : ''}"
										/>
										<span
											class="text-2xl transition-colors {userRating >= star ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}"
											aria-hidden="true"
										>★</span>
									</label>
								{/each}
							</div>
						</fieldset>

						<div class="mb-4">
							<label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
								Commentaire <span class="text-gray-400 font-normal">(optionnel)</span>
							</label>
							<textarea
								id="comment"
								name="comment"
								rows="3"
								bind:value={userComment}
								placeholder="Partagez votre avis sur ce Pokémon..."
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
							></textarea>
						</div>

						<div class="flex gap-2">
							<button
								type="submit"
								disabled={ratingLoading || userRating === 0}
								class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium rounded-lg text-sm transition-colors"
							>
								{ratingLoading ? 'Envoi...' : 'Publier mon avis'}
							</button>
							{#if data.userRating}
								<button
									type="button"
									onclick={() => (showRatingForm = false)}
									class="px-4 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50"
								>
									Annuler
								</button>
							{/if}
						</div>
					</form>
				{/if}
			</div>
		{:else}
			<div class="bg-gray-50 rounded-xl p-6 mb-6 text-center text-sm text-gray-500">
				<a href="/login" class="text-red-600 hover:underline font-medium">Connectez-vous</a>
				pour laisser un avis.
			</div>
		{/if}

		<!-- Ratings list -->
		{#if data.ratings.length > 0}
			<div class="space-y-4">
				{#each data.ratings as rating}
					<div class="bg-white rounded-xl shadow-sm p-4">
						<div class="flex items-center justify-between mb-2">
							<span class="font-medium text-gray-700 text-sm">
								{rating.profiles?.username ?? 'Anonyme'}
							</span>
							<div class="flex gap-0.5" aria-label="Note: {rating.rating} sur 5">
								{#each [1, 2, 3, 4, 5] as star}
									<span class="text-sm {star <= rating.rating ? 'text-yellow-400' : 'text-gray-200'}" aria-hidden="true">★</span>
								{/each}
							</div>
						</div>
						{#if rating.comment}
							<p class="text-gray-600 text-sm">{rating.comment}</p>
						{/if}
						<p class="text-xs text-gray-400 mt-2">
							{new Date(rating.created_at).toLocaleDateString('fr-FR')}
						</p>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-gray-400 text-center py-8">Aucun avis pour ce Pokémon. Soyez le premier !</p>
		{/if}
	</div>
</div>
