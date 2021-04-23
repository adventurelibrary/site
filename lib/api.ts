import axios from 'axios'

const base = <string>process.env.ADVL_BASE_URL
console.log('API URL', base)

let jwt = ''
export const api = axios.create({
	baseURL: base,
})
api.interceptors.response.use((response) => {
	return response
}, (err) => {
	if (err.response && err.response.body && err.response.data && err.response.data.error) {
		return Promise.reject(err.response.data.error)
	}
	return Promise.reject(err.toString())
})

api.interceptors.request.use(function (config) {
	config.headers.Authorization = jwt
	return config;
}, function (error) {
	return Promise.reject(error);
});

// The JWT that all our requests use is set by this function
// The function is called in our auth.ts middleware file
// Depending on context (server vs client) it will get the JWT
// from a different place
export function setJWT(newJWT: string) {
	jwt = newJWT
}


export default api
