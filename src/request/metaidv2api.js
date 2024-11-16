// showapi相关接口
import { get, post } from './http'

export const getMetaidManHost = async () => {
	let network = 'mainet'
	if (window.metaidwallet) {
		network = (await window.metaidwallet.getNetwork()).network
	}
	if ('testnet' == network) {
		return 'https://man-test.metaid.io'
	}
	return 'https://man.metaid.io'
}

export const getAllPinByPath = async (page, limit, path) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/getAllPinByPath?page=${page}&limit=${limit}&path=${path}`

	return get(url)
}

export const getOwneAllPinByPath = async (page, limit, path, address) => {
	const metaidManHost = await getMetaidManHost()

	const url = `${metaidManHost}/api/address/pin/list/owner/${address}?cnt=true&cursor=${
		(page - 1) * limit
	}&size=${limit}&path=${path}`

	return get(url)
}

export const getAllPinByPathAndMetaId = async (p) => {
	const metaidManHost = await getMetaidManHost()
	let url = `${metaidManHost}/api/getAllPinByPathAndMetaId`

	return post(url, p)
}

export const queryOneBuzz = async (id) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/pin/${id}`
	return get(url)
}

export const getMetaidByAddress = async (address) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/info/address/${address}`
	return get(url)
}

export const getFollowingList = async (metaid, cursor, size) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/metaid/followingList/${metaid}?cursor=${cursor}&size=${size}&followDetail=false`
	return get(url)
}

export const getFollowerList = async (metaid, cursor, size) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/metaid/followerList/${metaid}?cursor=${cursor}&size=${size}&followDetail=false`
	return get(url)
}

export const getFollowRecord = async (metaid, followerMetaId) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/follow/record?metaId=${metaid}&followerMetaId=${followerMetaId}`
	return get(url)
}

export const generalQuery = async (p) => {
	const metaidManHost = await getMetaidManHost()
	const url = `${metaidManHost}/api/generalQuery`
	return post(url, p)
}

export async function notify({ txHex }) {
	const url = 'https://api.metaid.io/metaid-base/v1/meta/upload/raw'

	await post(url, {
		raw: txHex,
		type: 1
	})
}
