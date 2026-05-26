<script lang="ts">
  const { data } = $props();
</script>

<div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
	<div class="text-center">
		<h1 class="text-5xl font-bold text-gray-800 mb-4">Welcome to SvelteKit</h1>
		<p class="text-xl text-gray-600 mb-8">Your modern web framework</p>
		<div class="flex gap-4 justify-center">
			<a href="/pokemon" class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Pokémon</a>
			<a href="/users" class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Users</a>
			<a href="/account" onclick={() => location.assign('/account')} class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Account</a>
			<a href="/login" onclick={() => location.assign('/login')} class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Login</a>
		</div>
	</div>
</div>

