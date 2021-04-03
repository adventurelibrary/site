import axios from 'axios'

const base = <string>process.env.ADVL_BASE_URL
console.log('API URL', base)

export const api = axios.create({
	baseURL: base,
})
api.interceptors.response.use((response) => {
	return response
}, (err) => {
	if (err.response && err.response.body && err.response.data && err.response.data.error) {
		return Promise.reject(err.response.data.error)
	}
	return Promise.reject('Err with request')
})
export default api
