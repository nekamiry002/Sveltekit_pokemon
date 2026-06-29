export const safeFetch = async <T>(
	url: string,
	options?: RequestInit
): Promise<[T | null, string | null]> => {
	try {
		const response = await fetch(url, {
			headers: { 'Content-Type': 'application/json' },
			...options,
		})

		if (!response.ok) {
			return [null, `Erreur ${response.status}: ${response.statusText} `]
		}

		const data = await response.json()
		return [data, null]
	} catch {
		return [null, 'Erreur de réseau']
	}
}
