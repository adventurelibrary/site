import axios from 'axios'

const base = <string>process.env.ADVL_BASE_URL

export const api = axios.create({
	baseURL: base,
})
api.interceptors.response.use((response) => {
	return response
}, (err) => {
	console.log('err', err)
	Promise.reject(new Error('Oh no!'))
})
export default api
