import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession()
	if (user) redirect(303, '/account')
	return {}
}

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const data = await request.formData()
		const email = data.get('email') as string
		const password = data.get('password') as string

		if (!email || !password) {
			return fail(400, { type: 'login', error: 'Email et mot de passe requis', email })
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password })

		if (error) {
			return fail(400, { type: 'login', error: error.message, email })
		}

		redirect(303, '/account')
	},

	signup: async ({ request, locals: { supabase }, url }) => {
		const data = await request.formData()
		const email = data.get('email') as string
		const password = data.get('password') as string

		if (!email || !password) {
			return fail(400, { type: 'signup', error: 'Email et mot de passe requis', email })
		}

		if (password.length < 6) {
			return fail(400, {
				type: 'signup',
				error: 'Le mot de passe doit faire au moins 6 caractères',
				email,
			})
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: `${url.origin}/auth/confirm` },
		})

		if (error) {
			return fail(400, { type: 'signup', error: error.message, email })
		}

		return {
			type: 'signup',
			success: true,
			message: 'Compte créé ! Vérifiez votre email ou connectez-vous directement.',
		}
	},
}
