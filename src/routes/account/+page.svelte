<script lang="ts">
	import { enhance } from '$app/forms'
	import ProfileCard from '$lib/components/ProfileCard.svelte'
	import { favoritesStore } from '$lib/state/favorites.svelte'
	import { teamStore } from '$lib/state/team.svelte'
	import type { Profile } from '$lib/types/database'

	let { data, form } = $props()

	let loading = $state(false)
	let profile = $state<Profile | null>(null)
	let fullName = $state('')
	let username = $state('')
	let website = $state('')

	$effect(() => {
		profile = data.profile
		fullName = data.profile?.full_name ?? ''
		username = data.profile?.username ?? ''
		website = data.profile?.website ?? ''
	})
</script>

<svelte:head>
	<title>Mon compte — Pokédex</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-gray-800 mb-8">Mon compte</h1>

	<div class="grid md:grid-cols-3 gap-8">
		<!-- Profile card -->
		<div class="md:col-span-1">
			<ProfileCard
				{profile}
				email={data.user?.email ?? ''}
				favoritesCount={favoritesStore.items.length}
				teamCount={teamStore.members.length}
			/>

			<!-- Quick links -->
			<div class="mt-4 space-y-2">
				<a
					href="/favorites"
					class="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
				>
					<span class="text-red-500" aria-hidden="true">♥</span>
					Mes favoris ({favoritesStore.items.length})
				</a>
				<a
					href="/team"
					class="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700"
				>
					<span aria-hidden="true">🏆</span>
					Mon équipe ({teamStore.members.length}/6)
				</a>
			</div>
		</div>

		<!-- Edit profile form -->
		<div class="md:col-span-2">
			<div class="bg-white rounded-xl shadow-md p-6">
				<h2 class="text-xl font-semibold text-gray-800 mb-6">Modifier le profil</h2>

				{#if form?.success}
					<div
						class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
						role="alert"
					>
						Profil mis à jour !
					</div>
				{/if}

				{#if form?.error}
					<div
						class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
						role="alert"
					>
						{form.error}
					</div>
				{/if}

				<form
					method="POST"
					action="?/updateProfile"
					use:enhance={() => {
						loading = true
						return async ({ update }) => {
							loading = false
							await update()
						}
					}}
				>
					<div class="space-y-4">
						<div>
							<label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">
								Nom complet
							</label>
							<input
								id="full_name"
								name="full_name"
								type="text"
								bind:value={fullName}
								placeholder="Ash Ketchum"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
							/>
						</div>

						<div>
							<label for="username" class="block text-sm font-medium text-gray-700 mb-1">
								Nom d'utilisateur
							</label>
							<div class="relative">
								<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
								<input
									id="username"
									name="username"
									type="text"
									bind:value={username}
									placeholder="ash_ketchum"
									class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
								/>
							</div>
						</div>

						<div>
							<label for="website" class="block text-sm font-medium text-gray-700 mb-1">
								Site web
							</label>
							<input
								id="website"
								name="website"
								type="url"
								bind:value={website}
								placeholder="https://monsite.com"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
							/>
						</div>

						<div class="pt-2 flex gap-3">
							<button
								type="submit"
								disabled={loading}
								class="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors"
							>
								{loading ? 'Sauvegarde...' : 'Sauvegarder'}
							</button>
						</div>
					</div>
				</form>
			</div>

			<!-- Sign out -->
			<div class="mt-4 bg-white rounded-xl shadow-md p-6">
				<h2 class="text-lg font-semibold text-gray-800 mb-3">Session</h2>
				<p class="text-sm text-gray-500 mb-4">
					Connecté en tant que <span class="font-medium text-gray-700">{data.user?.email}</span>
				</p>
				<form method="POST" action="?/signout">
					<button
						type="submit"
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
					>
						Se déconnecter
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
