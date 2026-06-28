<script lang="ts">
	import type { Profile } from '$lib/types/database'

	interface Props {
		profile: Profile | null
		email: string
		favoritesCount?: number
		teamCount?: number
	}

	let { profile, email, favoritesCount = 0, teamCount = 0 }: Props = $props()
</script>

<div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center gap-4">
	<!-- Avatar -->
	<div class="relative">
		{#if profile?.avatar_url}
			<img
				src={profile.avatar_url}
				alt="Avatar de {profile.full_name ?? email}"
				class="w-20 h-20 rounded-full object-cover ring-4 ring-red-100"
			/>
		{:else}
			<div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center ring-4 ring-red-200" aria-hidden="true">
				<span class="text-2xl font-bold text-red-600">
					{(profile?.full_name ?? email).charAt(0).toUpperCase()}
				</span>
			</div>
		{/if}
	</div>

	<!-- Identity -->
	<div class="text-center">
		{#if profile?.full_name}
			<p class="text-lg font-bold text-gray-800">{profile.full_name}</p>
		{/if}
		{#if profile?.username}
			<p class="text-sm text-gray-500">@{profile.username}</p>
		{/if}
		<p class="text-sm text-gray-400">{email}</p>
	</div>

	<!-- Stats -->
	<div class="flex gap-6 text-center">
		<div>
			<p class="text-xl font-bold text-red-600">{favoritesCount}</p>
			<p class="text-xs text-gray-500">Favoris</p>
		</div>
		<div>
			<p class="text-xl font-bold text-red-600">{teamCount}</p>
			<p class="text-xs text-gray-500">Équipe</p>
		</div>
	</div>
</div>
