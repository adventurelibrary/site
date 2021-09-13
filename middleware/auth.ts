import {Context} from "@nuxt/types";
import {setJWT} from "~/lib/api"

let fetchedSession = false

// This middleware fetches the session data for the currently logged in user
// when doing SSR
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
	// clientside cookies just fine with the getCookie function, so that's done there
	const user = ctx.store.state.user
	if (!user) {
		// If we're on client, we only check for their session the once, not on every route
		if (process.client) {
			console.log('client')
			if (!fetchedSession) {
				console.log('not already fetched')
				fetchedSession = true
				await ctx.store.dispatch('fetchSession')
			}
		} else {
			console.log('not client')
			await ctx.store.dispatch('fetchSession')
		}
	}
	return null
}
