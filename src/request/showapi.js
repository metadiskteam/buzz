// showapi相关接口
import { post, get } from './http'

export const getMetaIdByZoreAddress = (zeroAddress) => {
	const p = '{"data":"{\\"zeroAddress\\":\\"' + zeroAddress + '\\"}"}'
	return post(
		'https://api.showmoney.app/serviceapi/api/v1/metago/getMetaIdByZoreAddress',
		p,
		{
			headers: {
				'content-type': 'application/json'
			}
		}
	)
}

export const getUserSimpleInfo = (rootTxId) => {
	return get(
		'https://api.showmoney.app/aggregation/v2/app/user/getUserSimpleInfo/' +
			rootTxId
	)
}

export const notify = (txHex) => {
	return post('https://api.show3.io/metaid-base/v1/meta/upload/raw', {
		raw: txHex,
		type: 201
	})
}
