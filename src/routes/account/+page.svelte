<script lang="ts">
	export const ssr = false;

	import { onMount } from 'svelte'
	import { supabase } from '$lib/supabaseClient'

	let loading = $state(false)
	let session: any = $state(null)
	let profile: any = $state(null)
	let fullName = $state('')
	let username = $state('')
	let website = $state('')
	let notice: string | null = $state(null)
	let initialLoading = $state(true)
	let message: string | null = $state(null)

	onMount(async () => {
		const { data } = await supabase.auth.getSession()
		session = data?.session ?? null
		if (!session) {
			location.assign('/login')
			return
		}

		const userId = session.user.id
		const { data: p } = await supabase
			.from('profiles')
			.select('username, full_name, website, avatar_url')
			.eq('id', userId)
			.single()

		profile = p
		fullName = profile?.full_name ?? ''
		username = profile?.username ?? ''
		website = profile?.website ?? ''

		const noticeParam = new URL(location.href).searchParams.get('notice')
		if (noticeParam === 'connecte') notice = 'Connecté'
		initialLoading = false
	})

	async function updateProfile() {
		loading = true
		message = null
		const { data: upserted, error } = await supabase
			.from('profiles')
			.upsert(
				{
					id: session.user.id,
					full_name: fullName,
					username,
					website,
					updated_at: new Date(),
				},
				{ returning: 'representation' }
			)
		loading = false
		if (error) {
			message = `Erreur: ${error.message}`
		} else {
			profile = Array.isArray(upserted) ? upserted[0] : upserted
			message = 'Profil mis à jour.'
		}
	}

	async function signOut() {
		await supabase.auth.signOut()
		location.assign('/login')
	}
</script>

{#if initialLoading}
	<div class="p-6 text-center">Chargement des données...</div>
{:else}
	<div class="form-widget">
		<div class="mb-4">
			<div class="flex items-center gap-4">
				{#if profile?.avatar_url}
					<img src={profile.avatar_url} alt="avatar" class="w-16 h-16 rounded-full" />
				{/if}
				<div>
					<div class="font-medium">{session?.user?.email}</div>
					<div class="text-sm text-gray-600">ID: {session?.user?.id}</div>
				</div>
			</div>
		</div>

		<div>
			<label for="fullName">Full Name</label>
			<input id="fullName" bind:value={fullName} class="p-2 border rounded w-full" type="text" />
		</div>

		<div class="mt-3">
			<label for="username">Username</label>
			<input id="username" bind:value={username} class="p-2 border rounded w-full" type="text" />
		</div>

		<div class="mt-3">
			<label for="website">Website</label>
			<input id="website" bind:value={website} class="p-2 border rounded w-full" type="url" />
		</div>

		{#if notice}
			<div class="mb-3 text-green-600">{notice}</div>
		{/if}

		{#if message}
			<div class="mb-3 text-red-600">{message}</div>
		{/if}

		<div class="mt-4">
			<button type="button" class="bg-indigo-600 text-white py-2 px-4 rounded w-full" onclick={updateProfile} disabled={loading}>
				{loading ? 'Mise à jour...' : 'Mettre à jour'}
			</button>
		</div>

		<div class="mt-2">
			<button type="button" class="border py-2 px-4 rounded w-full" onclick={signOut}>Se déconnecter</button>
		</div>
	</div>
{/if}