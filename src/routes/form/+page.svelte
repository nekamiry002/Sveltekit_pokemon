<script>
    let name = $state('Keryan');
    let age = $state(22);

    let user = $derived({
        profile: { name: name , age: age},
        hobbies: ['gaming', 'coding']
    })
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-2xl mx-auto">
		<h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">User Profile Form</h1>
		
		<form class="bg-white rounded-lg shadow-md p-8 mb-8">
			<div class="mb-6">
				<label for="nom" class="block text-gray-700 font-semibold mb-2">Nom</label>
				<input id="nom" bind:value={name} placeholder="Nom" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
			</div>
			<div class="mb-6">
				<label for="age" class="block text-gray-700 font-semibold mb-2">Âge</label>
				<input id="age" bind:value={age} type="number" placeholder="Âge" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
			</div>
		</form>

		<div class="bg-white rounded-lg shadow-md p-8">
			<h2 class="text-2xl font-bold text-gray-800 mb-4">Hello {user.profile.name} 👋</h2>
			<p class="text-gray-700 mb-4">Vous avez <span class="font-semibold text-blue-600">{user.profile.age} ans</span> et vos hobbies sont:</p>
			<ul class="list-disc list-inside space-y-2">
				{#each user.hobbies as hobby}
					<li class="text-gray-700 capitalize">le {hobby}</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
