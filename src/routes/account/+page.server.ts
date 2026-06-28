import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession()
	if (!user) redirect(303, '/login')

	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.single()

	return { user, profile }
}

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession()
		if (!user) return fail(401, { error: 'Non authentifié' })

		const data = await request.formData()
		const full_name = data.get('full_name') as string
		const username = data.get('username') as string
		const website = data.get('website') as string

		const { error } = await supabase.from('profiles').upsert({
			id: user.id,
			full_name,
			username: username || null,
			website: website || null,
			updated_at: new Date().toISOString(),
		})

		if (error) {
			if (error.code === '23505') {
				return fail(400, { error: "Ce nom d'utilisateur est déjà pris" })
			}
			return fail(400, { error: error.message })
		}

		return { success: true }
	},

	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut()
		redirect(303, '/login')
	},
}
