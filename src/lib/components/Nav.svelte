<script lang="ts">
	import { page } from '$app/state'
	import { authStore } from '$lib/state/auth.svelte'
	import { teamStore } from '$lib/state/team.svelte'
	import { compareStore } from '$lib/state/compare.svelte'

	let mobileOpen = $state(false)

	const links = [
		{ href: '/pokemon', label: 'Pokédex' },
		{ href: '/favorites', label: 'Favoris' },
		{ href: '/team', label: 'Mon Équipe' },
	]

	function isActive(href: string) {
		return page.url.pathname.startsWith(href)
	}
</script>

<nav class="bg-red-600 shadow-lg sticky top-0 z-50" aria-label="Navigation principale">
	<div class="max-w-6xl mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 text-white font-bold text-xl" aria-label="Accueil Pokédex">
				<span class="text-2xl" aria-hidden="true">⬤</span>
				<span>Pokédex</span>
			</a>

			<!-- Desktop nav -->
			<div class="hidden md:flex items-center gap-1">
				{#each links as link}
					<a
						href={link.href}
						class="px-3 py-2 rounded-lg text-sm font-medium transition-colors
							{isActive(link.href)
								? 'bg-red-800 text-white'
								: 'text-red-100 hover:bg-red-700 hover:text-white'}"
						aria-current={isActive(link.href) ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}

				{#if compareStore.ids.length > 0}
					<a
						href="/compare?ids={compareStore.toQueryString()}"
						class="ml-2 px-3 py-2 rounded-lg text-sm font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors"
					>
						Comparer ({compareStore.ids.length})
					</a>
				{/if}
			</div>

			<!-- Auth + team badge -->
			<div class="hidden md:flex items-center gap-3">
				{#if teamStore.members.length > 0}
					<a href="/team" class="text-yellow-300 text-sm font-medium" aria-label="Mon équipe: {teamStore.members.length} Pokémon">
						🏆 {teamStore.members.length}/6
					</a>
				{/if}

				{#if authStore.isAuthenticated}
					<a
						href="/account"
						class="px-3 py-2 bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
					>
						Mon compte
					</a>
				{:else}
					<a
						href="/login"
						class="px-3 py-2 bg-white text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
					>
						Connexion
					</a>
				{/if}
			</div>

			<!-- Mobile hamburger -->
			<button
				class="md:hidden text-white p-2 rounded-lg hover:bg-red-700"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
				aria-expanded={mobileOpen}
			>
				{#if mobileOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile menu -->
		{#if mobileOpen}
			<div class="md:hidden pb-4 flex flex-col gap-1">
				{#each links as link}
					<a
						href={link.href}
						class="px-3 py-2 rounded-lg text-sm font-medium text-red-100 hover:bg-red-700 hover:text-white transition-colors"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				{#if compareStore.ids.length > 0}
					<a
						href="/compare?ids={compareStore.toQueryString()}"
						class="px-3 py-2 rounded-lg text-sm font-medium bg-yellow-400 text-gray-900"
						onclick={() => (mobileOpen = false)}
					>
						Comparer ({compareStore.ids.length})
					</a>
				{/if}
				{#if authStore.isAuthenticated}
					<a href="/account" class="px-3 py-2 text-white font-semibold" onclick={() => (mobileOpen = false)}>
						Mon compte
					</a>
				{:else}
					<a href="/login" class="px-3 py-2 text-white font-semibold" onclick={() => (mobileOpen = false)}>
						Connexion
					</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>
