import axios from 'axios'

const base = <string>process.env.ADVL_BASE_URL

console.log('base', base)

export const api = axios.create({
	baseURL: base
})
export default api
