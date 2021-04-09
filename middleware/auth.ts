import {Context} from "@nuxt/types";

import {setJWT} from "~/lib/api"
import {getCookie} from "~/lib/helpers";

export default function (ctx: Context) {
	let jwt = ''
	const {req} = ctx
	if (req && req.headers.cookie) {
		const cookies = req.headers.cookie.split(';')
		for (const c of cookies) {
			const parts = c.split('=')
			const name = parts[0].trim()
			if (name === 'jwt') {
				jwt = parts[1]
				break
			}
		}
	}
	if (process.client) {
		const jwtS = getCookie('jwt')
		if (jwtS !== null) {
			jwt = jwtS
		}
	}

	setJWT(jwt)
	return null
}
