import type { Session, User } from '@supabase/supabase-js'

class AuthState {
	user = $state<User | null>(null)
	session = $state<Session | null>(null)

	get isAuthenticated() {
		return !!this.user
	}

	init(user: User | null, session: Session | null) {
		this.user = user
		this.session = session
	}

	clear() {
		this.user = null
		this.session = null
	}
}

export const authStore = new AuthState()
