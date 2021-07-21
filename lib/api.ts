import axios from 'axios'
import {getCookie} from "~/lib/helpers";

const base = <string>process.env.ADVL_BASE_URL
console.log('API URL', base)

let jwt = ''
export const api = axios.create({
	baseURL: base,
})
api.interceptors.response.use((response) => {
	return response
}, (err) => {
	let msg = 'A server error occured'
	if (err.response && err.response.data && err.response.data.error) {
		if (err.response.data.error.message) {
			msg = err.response.data.error.message
		} else {
			msg = JSON.stringify(err.response.data.error)
		}
	} else {
		msg = err.toString()
	}

	const throwingError = new Error(msg)
	// @ts-ignore
	throwingError.statusCode = err.response.status
	// @ts-ignore
	throw throwingError
})

api.interceptors.request.use(function (config) {
	if (process.client && !jwt) {
		jwt = <string>getCookie('jwt')
	}
	if (jwt) {
		config.headers.Authorization = 'JWT ' + jwt
	}
	return config;
}, function (error) {
	return Promise.reject(error);
});

// The JWT that all our requests use is set by this function
// The function is called in our auth.ts middleware file
// Depending on context (server vs client) that middleware will get the JWT
// from a different place (client cookie or request cookie, at time of writing)
export function setJWT(newJWT: string) {
	jwt = newJWT
}

export function getJWT () : string {
	return jwt
}


export default api
