import axios, { AxiosInstance } from 'axios'

/**
 * @return {{http: AxiosInstance}}
 */
export const createHttp = () => ({
	http: axios.create({
		baseURL: import.meta.env.VITE_API_BASE_URL,
	}),
})
