import axios from 'axios'

export let api = {}
export const setBaseURL = function (url: string) {
	api = axios.create({
		baseURL: url
	})
}

export default api
