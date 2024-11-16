let blockApi = {}

import { post } from '@/request/http'

blockApi.broadcast = async function (hex, options) {
	if (options.blockChain.toUpperCase() === 'MVC') {
		const mvcServerBase = `https://${options.chainNetwork}.mvcapi.com`
		return await post(`${mvcServerBase}/tx/broadcast`, {
			hex
		})
	}

	throw new Error('not support')
}

export default blockApi
