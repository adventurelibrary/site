import {Context} from "@nuxt/types";
import {setJWT} from "~/lib/api"

export default async function (ctx: Context) {
	let jwt = ''
	const {req} = ctx
	// The req is only present in server side rendering mode
	// This will find the cookie for the domain that holds the JWT
	// then we set the JWT in our api with setJWT so that it knows
	// to use that JWT in the auth header
	if (req && req.headers.cookie) {
		const cookies = req.headers.cookie.split(';').sort((a, b) => {
			return a.length > b.length ? -1 : 1
		})
		for (const c of cookies) {
			const parts = c.split('=')
			const name = parts[0].trim()
			if (name === 'jwt') {
				jwt = parts[1]
				break
			}
		}
		setJWT(jwt)
	}

	// For the client we don't handle that here, the lib/api file can detect
	// clientside cookies just find with the getCookie function, so that's done there

	await ctx.store.dispatch('fetchSession')
	return null
}
