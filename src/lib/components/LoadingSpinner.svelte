<script lang="ts">
	let { message = 'Chargement...' }: { message?: string } = $props()
</script>

<div class="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-live="polite">
	<div
		class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"
	></div>
	<p class="text-gray-500 text-sm">{message}</p>
</div>
