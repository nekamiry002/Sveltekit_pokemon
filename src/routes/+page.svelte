<script lang="ts">
	import { authStore } from '$lib/state/auth.svelte'
</script>

<svelte:head>
	<title>Pokédex — Accueil</title>
</svelte:head>

<!-- Hero -->
<div class="bg-linear-to-br from-red-600 to-red-800 text-white">
	<div class="max-w-5xl mx-auto px-4 py-20 text-center">
		<div class="text-8xl mb-6" role="img" aria-label="Pokéball">⬤</div>
		<h1 class="text-5xl font-bold mb-4">Pokédex</h1>
		<p class="text-xl text-red-200 mb-8 max-w-xl mx-auto">
			Explorez les 151 premiers Pokémon, construisez votre équipe et partagez vos avis.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/pokemon"
				class="px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-lg shadow-lg"
			>
				Voir le Pokédex
			</a>
			{#if !authStore.isAuthenticated}
				<a
					href="/login"
					class="px-8 py-3 bg-red-700 hover:bg-red-900 text-white font-bold rounded-xl transition-colors text-lg border border-red-500"
				>
					Créer un compte
				</a>
			{:else}
				<a
					href="/team"
					class="px-8 py-3 bg-red-700 hover:bg-red-900 text-white font-bold rounded-xl transition-colors text-lg border border-red-500"
				>
					Mon équipe
				</a>
			{/if}
		</div>
	</div>
</div>

<!-- Features -->
<div class="max-w-5xl mx-auto px-4 py-16">
	<h2 class="text-2xl font-bold text-gray-800 text-center mb-10">Fonctionnalités</h2>
	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
		<a
			href="/pokemon"
			class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center group"
		>
			<div class="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
				🔍
			</div>
			<h3 class="font-bold text-gray-800 mb-2">Recherche & Filtres</h3>
			<p class="text-sm text-gray-500">Trouvez n'importe quel Pokémon par nom, numéro ou type</p>
		</a>

		<a
			href="/favorites"
			class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center group"
		>
			<div class="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
				♥
			</div>
			<h3 class="font-bold text-gray-800 mb-2">Favoris</h3>
			<p class="text-sm text-gray-500">
				Sauvegardez vos Pokémon préférés pour les retrouver facilement
			</p>
		</a>

		<a
			href="/team"
			class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center group"
		>
			<div class="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
				🏆
			</div>
			<h3 class="font-bold text-gray-800 mb-2">Équipe</h3>
			<p class="text-sm text-gray-500">Composez votre équipe de 6 Pokémon idéaux</p>
		</a>

		<div
			class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center group cursor-default"
		>
			<div class="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
				⊞
			</div>
			<h3 class="font-bold text-gray-800 mb-2">Comparaison</h3>
			<p class="text-sm text-gray-500">Comparez les statistiques de 2 à 3 Pokémon côte à côte</p>
		</div>
	</div>
</div>

<!-- CTA Auth -->
{#if !authStore.isAuthenticated}
	<div class="bg-gray-800 text-white py-12">
		<div class="max-w-2xl mx-auto px-4 text-center">
			<h2 class="text-2xl font-bold mb-3">Rejoignez la communauté</h2>
			<p class="text-gray-400 mb-6">
				Créez un compte gratuit pour sauvegarder vos favoris, gérer votre équipe et laisser des
				avis.
			</p>
			<a
				href="/login"
				class="inline-block px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
			>
				Créer un compte gratuit
			</a>
		</div>
	</div>
{/if}
