import i18n from '@/lang'
import axios from 'axios'
import globalConfig from '@/config/index.js'
import { Message } from 'element-ui'

// 请求超时时间
axios.defaults.timeout = 10000 * 20

// 请求基础 URL
axios.defaults.baseURL = globalConfig.baseContext

// POST 请求头
axios.defaults.headers.post['Content-Type'] =
	'application/x-www-form-urlencoded'

// 请求携带cookie
axios.defaults.withCredentials = false

// 请求拦截器
axios.interceptors.request.use(
	(config) => {
		return config
	},
	(error) => {
		console.log(error)
		return Promise.reject(error)
	}
)

// 响应拦截器
axios.interceptors.response.use(
	async (response) => {
		if (
			response.config.url.indexOf('https://man.metaid.io') > -1 ||
			response.config.url.indexOf('https://man-test.metaid.io') > -1
		) {
			return response.data
		}
		const code = response.data.code || 0
		let msg = response.data.msg || i18n.t('errorCode_default')
		if (code !== 0) {
			Message.warning(msg)
			return Promise.reject(response)
		} else {
			return response.data
		}
	},

	(err) => {
		//console.log(err)
		let { message } = err
		if (!message) {
			message = i18n.t('lost_0024')
		} else if (message === 'Network Error') {
			message = i18n.t('lost_0025')
		} else if (message.includes('timeout')) {
			message = i18n.t('lost_0026')
		} else if (message.includes('Request failed with status code')) {
			message = i18n.t('lost_0027', [message.substring(message.length - 3)])
		}
		Message.warning(message)
		return Promise.reject(err)
	}
)

/**
 * 封装 get方法 对应 GET 请求
 * @param {string} url 请求url
 * @param {object} params 查询参数
 * @returns {Promise}
 */
export function get(url, params, options) {
	return new Promise((resolve, reject) => {
		const config = {
			params: params,
			...options
		}
		//console.log('config:', config)
		axios
			.get(url, config)
			.then((res) => {
				if (res?.data) {
					resolve(res.data)
				} else {
					resolve(res)
				}
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}
/**
 * 封装 post 方法，对应 POST 请求
 * @param {string} url 请求url
 * @param {object} data 请求体
 * @param {boolean | undefined} info 请求体是否为 FormData 格式
 * @returns {Promise}
 */
export function post(url, data = {}, config) {
	return new Promise((resolve, reject) => {
		let newData = data
		if (config?.info) {
			//  转formData格式
			newData = new FormData()
			for (let i in data) {
				newData.append(i, data[i])
			}
		}
		axios
			.post(url, newData, config)
			.then((res) => {
				//console.log('post', res)
				if (res?.data) {
					resolve(res.data)
				} else {
					resolve(res)
				}
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}

/**
 * 封装 put 方法，对应 PUT 请求
 * @param {string} url 请求url
 * @param {object} params 请求体
 * @returns {Promise}
 */
export function put(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, params).then(
			(res) => {
				resolve(res.data)
			},
			(err) => {
				reject(err.data)
			}
		)
	})
}

/**
 * 封装 axiosDelete 方法，对应 DELETE 请求
 * @param {string} url 请求url
 * @param {object} params 请求体
 * @returns {Promise}
 */
export function axiosDelete(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios
			.delete(url, params)
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err.data)
			})
	})
}
