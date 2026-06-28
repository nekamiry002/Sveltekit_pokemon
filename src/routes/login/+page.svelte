<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()

	let mode = $state<'login' | 'signup'>('login')
	let loading = $state(false)
</script>

<svelte:head>
	<title>Connexion — Pokédex</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
	<div class="w-full max-w-md">
		<!-- Card -->
		<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
			<!-- Header -->
			<div class="bg-red-600 px-8 py-6 text-center">
				<div class="text-4xl mb-2" aria-hidden="true">⬤</div>
				<h1 class="text-2xl font-bold text-white">Pokédex</h1>
				<p class="text-red-200 text-sm mt-1">
					{mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
				</p>
			</div>

			<div class="px-8 py-6">
				<!-- Mode tabs -->
				<div class="flex rounded-lg bg-gray-100 p-1 mb-6" role="tablist">
					<button
						type="button"
						role="tab"
						aria-selected={mode === 'login'}
						class="flex-1 py-2 text-sm font-medium rounded-md transition-all
							{mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
						onclick={() => (mode = 'login')}
					>
						Connexion
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={mode === 'signup'}
						class="flex-1 py-2 text-sm font-medium rounded-md transition-all
							{mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
						onclick={() => (mode = 'signup')}
					>
						Créer un compte
					</button>
				</div>

				<!-- Success message -->
				{#if form?.success && form?.message}
					<div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm" role="alert">
						{form.message}
					</div>
				{/if}

				<!-- Error message -->
				{#if form?.error}
					<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
						{form.error}
					</div>
				{/if}

				<!-- Login form -->
				{#if mode === 'login'}
					<form
						method="POST"
						action="?/login"
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
								<label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									id="login-email"
									name="email"
									type="email"
									required
									autocomplete="email"
									value={form?.email ?? ''}
									placeholder="vous@exemple.com"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">
									Mot de passe
								</label>
								<input
									id="login-password"
									name="password"
									type="password"
									required
									autocomplete="current-password"
									placeholder="••••••••"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								class="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors"
							>
								{loading ? 'Connexion...' : 'Se connecter'}
							</button>
						</div>
					</form>

				<!-- Signup form -->
				{:else}
					<form
						method="POST"
						action="?/signup"
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
								<label for="signup-email" class="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									id="signup-email"
									name="email"
									type="email"
									required
									autocomplete="email"
									value={form?.email ?? ''}
									placeholder="vous@exemple.com"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>

							<div>
								<label for="signup-password" class="block text-sm font-medium text-gray-700 mb-1">
									Mot de passe <span class="text-gray-400 font-normal">(6 caractères min.)</span>
								</label>
								<input
									id="signup-password"
									name="password"
									type="password"
									required
									minlength="6"
									autocomplete="new-password"
									placeholder="••••••••"
									class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								class="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors"
							>
								{loading ? 'Création...' : 'Créer le compte'}
							</button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>
</div>
