<script lang="ts">
	export const ssr = false;

	import { onMount } from 'svelte'
	import { supabase } from '$lib/supabaseClient'
	import { goto } from '$app/navigation'

	let email = $state('')
	let password = $state('')
	let loading = $state(false)
	let message: string | null = $state(null)
	let isSignup = $state(false)
	let session: any = $state(null)

	async function submit() {
		loading = true
		message = null

		try {
			if (isSignup) {
				const res = await fetch('/api/create-user', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ email, password }),
				})
				const result = await res.json()
				if (!res.ok) throw new Error(result.error || 'Signup failed')
				message = 'Compte créé — tu peux te connecter.'
				isSignup = false
			} else {
				const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password })
				if (error) throw error
				const session = signInData?.session
				if (!session) {
					const { data: sessionData } = await supabase.auth.getSession()
					if (!sessionData?.session) {
						throw new Error('Impossible de récupérer la session après connexion.')
					}
				}
				message = 'Connecté'
				location.assign('/account?notice=connecte')
			}
		} catch (err: any) {
			message = err?.message ?? 'An unexpected error occurred.'
		} finally {
			loading = false
		}
	}

	onMount(async () => {
		const { data } = await supabase.auth.getSession()
		session = data?.session ?? null
		if (session) goto('/account')
	})
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="row flex flex-center">
	<div class="col-6 form-widget">
		<h1 class="header">Login / Register</h1>
		{#if message}
			<div class="success">{message}</div>
		{/if}

		<div class="mb-3">
			<label for="email">Email</label>
			<input id="email" class="p-2 border rounded w-full" type="email" bind:value={email} placeholder="you@example.com" />
		</div>

		<div class="mb-3">
			<label for="password">Password</label>
			<input id="password" class="p-2 border rounded w-full" type="password" bind:value={password} placeholder="Password" />
		</div>

		<div class="mt-4">
			<button type="button" class="bg-indigo-600 text-white py-2 px-4 rounded w-full" onclick={submit} disabled={loading}>
				{loading ? 'Veuillez patienter...' : isSignup ? 'Créer le compte' : 'Se connecter'}
			</button>
		</div>

		<div class="mt-2">
			<button type="button" class="border py-2 px-4 rounded w-full" onclick={() => (isSignup = !isSignup)}>
				{isSignup ? 'J’ai déjà un compte' : 'Créer un compte'}
			</button>
		</div>

		{#if session}
			<div class="mt-3">
				<a href="/account" class="inline-block bg-green-600 text-white py-1 px-3 rounded">Account</a>
			</div>
		{/if}
	</div>
</div>