import type { TeamMember } from '$lib/types/database'

class TeamState {
	members = $state<TeamMember[]>([])
	loaded = $state(false)

	set(data: TeamMember[]) {
		this.members = [...data].sort((a, b) => a.slot - b.slot)
		this.loaded = true
	}

	inTeam(pokemonId: number): boolean {
		return this.members.some((m) => m.pokemon_id === pokemonId)
	}

	get isFull(): boolean {
		return this.members.length >= 6
	}

	add(member: TeamMember) {
		this.members = [...this.members, member].sort((a, b) => a.slot - b.slot)
	}

	remove(pokemonId: number) {
		this.members = this.members.filter((m) => m.pokemon_id !== pokemonId)
	}

	clear() {
		this.members = []
		this.loaded = false
	}
}

export const teamStore = new TeamState()
