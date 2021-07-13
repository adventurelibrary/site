import axios from 'axios'
import {getCookie} from "~/lib/helpers";

export const baseURL = <string>process.env.ADVL_BASE_URL
console.log('API URL', baseURL)

let jwt = ''
export const api = axios.create({
	baseURL: baseURL,
})
api.interceptors.response.use((response) => {
	return response
}, (err) => {
	if (err.response && err.response.data && err.response.data.error) {
		if (err.response.data.error.message) {
			return Promise.reject(err.response.data.error.message)
		}
		return Promise.reject(JSON.stringify(err.response.data.error))
	}
	return Promise.reject(err.toString())
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
