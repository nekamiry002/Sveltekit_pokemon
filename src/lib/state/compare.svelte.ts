const MAX_COMPARE = 3

class CompareState {
	ids = $state<number[]>([])

	toggle(id: number) {
		if (this.ids.includes(id)) {
			this.ids = this.ids.filter((i) => i !== id)
		} else if (this.ids.length < MAX_COMPARE) {
			this.ids = [...this.ids, id]
		}
	}

	has(id: number): boolean {
		return this.ids.includes(id)
	}

	get canAdd(): boolean {
		return this.ids.length < MAX_COMPARE
	}

	clear() {
		this.ids = []
	}

	toQueryString(): string {
		return this.ids.join(',')
	}
}

export const compareStore = new CompareState()
