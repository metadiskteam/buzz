import * as metaidv2api from '_r/metaidv2api.js'

import Compressor from 'compressorjs'
import CryptoJs from 'crypto-js'
import encHex from 'crypto-js/enc-hex'

const metaidv2Utils = {}

metaidv2Utils.handleBuzz = async function (item) {
	let summary = item.contentSummary
	const isSummaryJson = summary.startsWith('{') && summary.endsWith('}')
	const parseSummary = isSummaryJson ? JSON.parse(summary) : {}
	summary = isSummaryJson ? parseSummary.content : summary

	item.summary = summary
	item.txid = item.id.substr(0, item.id.length - 2)
	const attachmentsPids = (parseSummary.attachments ?? []).map(
		(d) => d.split('metafile://')[1]
	)

	item.attachmentsPids = attachmentsPids
	item.quotePin = parseSummary.quotePin
	//引用的buzz
	if (parseSummary.quotePin) {
		const quoteBuzz = await metaidv2api.queryOneBuzz(parseSummary.quotePin)
		await this.handleBuzz(quoteBuzz)
		item.quoteBuzz = quoteBuzz
	}

	if (item.address) {
		//获取metaid
		const metaidInfo =
			(await metaidv2api.getMetaidByAddress(item.address)) || {}

		if (!metaidInfo.name || metaidInfo.name.length == 0) {
			metaidInfo.name = metaidInfo?.metaid?.substr(0, 8)
		}
		//获取buzz的点赞数
		await this.getBuzzLikeRefStatus(item)
		//获取buzz的评论数
		await this.getBuzzCommentRefStatus(item)

		item.metaidInfo = metaidInfo
	} else {
		console.log('item.address is null', item)
	}
}

metaidv2Utils.getBuzzLikeRefStatus = async (item) => {
	const p = {
		collection: 'paylike',
		action: 'get',
		filterRelation: 'and',
		field: [],
		filter: [
			{
				operator: '=',
				key: 'likeTo',
				value: item.id
			}
		],
		cursor: 0,
		limit: 99999,
		sort: []
	}
	const res = await metaidv2api.generalQuery(p)
	if (res.length > 0) {
		item.likeCount = res.length
	}
}
metaidv2Utils.getBuzzCommentRefStatus = async (item) => {
	const p = {
		collection: 'paycomment',
		action: 'get',
		filterRelation: 'and',
		field: [],
		filter: [
			{
				operator: '=',
				key: 'commentTo',
				value: item.id
			}
		],
		cursor: 0,
		limit: 99999,
		sort: ['number', 'desc']
	}
	const res = await metaidv2api.generalQuery(p)

	if (res.length > 0) {
		item.commentCount = res.length
		item.commentList = []
		for (let i = 0; i < res.length; i++) {
			const comment = res[i]
			const commentBuzz = await metaidv2api.queryOneBuzz(comment.pinId)
			await metaidv2Utils.handleBuzz(commentBuzz)
			item.commentList.push(commentBuzz)
		}
	}
}

metaidv2Utils.fileToAttachment = async (file) => {
	async function readResult(blob) {
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onload = () => {
				// @ts-ignore
				const wordArray = CryptoJs.lib.WordArray.create(reader.result)
				// @ts-ignore
				const buffer = Buffer.from(reader.result)
				// console.log("buffer", buffer, reader.result);
				hex += buffer.toString('hex') // 更新hex
				// 增量更新计算结果
				sha256Algo.update(wordArray) // 更新hash
				resolve()
			}
			reader.readAsArrayBuffer(blob)
		})
	}
	// 分块读取，防止内存溢出，这里设置为20MB,可以根据实际情况进行配置
	const chunkSize = 20 * 1024 * 1024

	let hex = '' // 二进制
	const sha256Algo = CryptoJs.algo.SHA256.create()

	for (let index = 0; index < file.size; index += chunkSize) {
		await readResult(file.slice(index, index + chunkSize))
	}
	return {
		data: hex,
		fileName: file.name,
		fileType: file.type,
		sha256: encHex.stringify(sha256Algo.finalize()),
		size: file.size
	}
}

metaidv2Utils.compressImage = async (image) => {
	const compress = (quality) =>
		new Promise((resolve, reject) => {
			new Compressor(image, {
				quality,
				convertSize: 100_000, // 100KB
				success: resolve,
				error: reject
			})
		})

	// Use 0.6 compression ratio first; If the result is still larger than 1MB, use half of the compression ratio; Repeat 5 times until the result is less than 1MB, otherwise raise an error
	let useQuality = 0.6
	for (let i = 0; i < 5; i++) {
		const compressed = await compress(useQuality)
		if (compressed.size < 1_000_000) {
			return compressed
		}
		useQuality /= 2
	}

	throw new Error('Image is too large')
}

export default metaidv2Utils
