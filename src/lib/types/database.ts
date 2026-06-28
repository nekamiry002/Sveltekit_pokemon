export interface Profile {
	id: string
	username: string | null
	full_name: string | null
	avatar_url: string | null
	website: string | null
	updated_at: string
}

export interface Favorite {
	id: string
	user_id: string
	pokemon_id: number
	pokemon_name: string
	created_at: string
}

export interface TeamMember {
	id: string
	user_id: string
	pokemon_id: number
	pokemon_name: string
	slot: number
	created_at: string
}

export interface Rating {
	id: string
	user_id: string
	pokemon_id: number
	rating: number
	comment: string | null
	created_at: string
	profiles?: { username: string | null }
}
