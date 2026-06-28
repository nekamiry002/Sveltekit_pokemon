<script lang="ts">
	import '../app.css'
	import Nav from '$lib/components/Nav.svelte'
	import { authStore } from '$lib/state/auth.svelte'
	import { favoritesStore } from '$lib/state/favorites.svelte'
	import { teamStore } from '$lib/state/team.svelte'

	let { data, children } = $props()

	$effect(() => {
		authStore.init(data.user, data.session)
		favoritesStore.set(data.favorites ?? [])
		teamStore.set(data.team ?? [])
	})
</script>

<svelte:head>
	<title>Pokédex</title>
</svelte:head>

<Nav />

<main class="min-h-screen bg-gray-50">
	{@render children()}
</main>
