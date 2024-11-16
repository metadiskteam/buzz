let metaletUtils = {}

import config from '@/config/index.js'
import { TxComposer, mvc } from 'meta-contract'
import blockApi from '@/utils/blockApi'
import * as showapi from '_r/showapi.js'

const txApiOptions = {
	blockChain: config.blockChain_MVC,
	chainNetwork: config.blockChainNetwork,
	initStatus: 'initing'
}

metaletUtils.getCurrentWallet = function () {
	return config.metaletWallet
}

metaletUtils.init = async function () {
	if (txApiOptions.initStatus == 'inited') {
		return txApiOptions.network
	}

	txApiOptions.initStatus = 'initing'
	txApiOptions.chainNetwork = (await window.metaidwallet.getNetwork()).network
	txApiOptions.initStatus = 'inited'

	return txApiOptions.network
}

metaletUtils.getNetwork = async function () {
	if (txApiOptions.initStatus == 'inited') {
		return txApiOptions.chainNetwork
	}
	return (await window.metaidwallet.getNetwork()).network
}

metaletUtils.disconnect = async function () {
	await window.metaidwallet.disconnect()
}

//wallet
metaletUtils.getLoginUserType = function () {
	return config.LoginUserType_Wallet
}

metaletUtils.getZeroAddress = async function () {
	return await window.metaidwallet.getAddress()
}

metaletUtils.getAddress = async function (path) {
	return await window.metaidwallet.getAddress({ path })
}

metaletUtils.getUnspents = async function (address) {
	const utxoList = await window.metaidwallet.getUtxos(address)
	utxoList.map((item) => {
		item.txId = item.txid
		delete item.txid
		return item
	})
	return utxoList
}

metaletUtils.payLike = async function (likeTo) {
	if (!likeTo) {
		return
	}
	let data = {
		isLike: '1',
		likeTo
	}
	data = JSON.stringify(data)
	let opReturnFieldList = [
		Buffer.from('metaid'),
		Buffer.from('create'),
		Buffer.from('/protocols/paylike'),
		Buffer.from('0'),
		Buffer.from('1.0.0'),
		Buffer.from('text/plain;utf-8'),
		Buffer.from(data)
	]
	return await this.createPin(opReturnFieldList)
}

metaletUtils.payComment = async function (options) {
	if (!options.content || !options.commentTo) {
		return
	}
	let data = {
		content: options.content,
		commentTo: options.commentTo,
		contentType: 'text/plain'
	}
	data = JSON.stringify(data)
	let opReturnFieldList = [
		Buffer.from('metaid'),
		Buffer.from('create'),
		Buffer.from('/protocols/paycomment'),
		Buffer.from('0'),
		Buffer.from('1.0.0'),
		Buffer.from('text/plain;utf-8'),
		Buffer.from(data)
	]
	return await this.createPin(opReturnFieldList)
}

metaletUtils.payForward = async function (options) {
	if (!options.content | !options.quotePin) {
		return
	}
	return this.shareToBuzz([], options)
}

metaletUtils.following = async function (followingMetaId) {
	if (!followingMetaId) {
		return
	}

	let opReturnFieldList = [
		Buffer.from('metaid'),
		Buffer.from('create'),
		Buffer.from('/follow'),
		Buffer.from('0'),
		Buffer.from('1.0.0'),
		Buffer.from('text/plain;utf-8'),
		Buffer.from(followingMetaId)
	]
	return await this.createPin(opReturnFieldList)
}

metaletUtils.shareToBuzz = async function (options) {
	if (!options.content) {
		return
	}

	let data = {
		content: options.content,
		contentType: 'text/plain',
		quotePin: options.quotePin,
		attachments: options.attachments,
		mention: []
	}
	data = JSON.stringify(data)

	let opReturnFieldList = [
		Buffer.from('metaid'),
		Buffer.from('create'),
		Buffer.from('/protocols/simplebuzz'),
		Buffer.from('0'),
		Buffer.from('1.0.0'),
		Buffer.from('application/json;utf-8'),
		Buffer.from(data)
	]
	return await this.createPin(opReturnFieldList, options)
}

metaletUtils.createPin = async function (opReturnFieldList, options) {
	const transactions = options?.transactions || []

	const pinTxComposer = new TxComposer()
	let address = await this.getZeroAddress()
	pinTxComposer.appendP2PKHOutput({
		address: new mvc.Address(address, txApiOptions.chainNetwork),
		satoshis: 1
	})

	pinTxComposer.appendOpReturnOutput(opReturnFieldList)

	transactions.push({
		txComposer: pinTxComposer,
		message: 'Create Pin'
	})

	if (options?.serialAction === 'combo') {
		return { transactions }
	}

	const payedRes = await window.metaidwallet.pay({
		transactions: transactions.map((transaction) => {
			return {
				txComposer: transaction.txComposer.serialize(),
				message: transaction.message
			}
		}),
		hasMetaid: true
	})
	if (payedRes.status == 'canceled') {
		return null
	}
	const mapedPayedRes = payedRes.payedTransactions.map(
		(txComposerSerialized) => {
			return TxComposer.deserialize(txComposerSerialized)
		}
	)
	// 广播交易
	for (const txComposer of mapedPayedRes) {
		const broadcastRes = await blockApi.broadcast(
			txComposer.getRawHex(),
			txApiOptions
		)

		const parsedBoradcastRes = this.parseSubmitTxId(broadcastRes)
		if (parsedBoradcastRes) {
			try {
				showapi.notify(txComposer.getRawHex())
			} catch (error) {
				console.log('notify-show-error:', error)
			}
		}
	}
	const lastTxid = mapedPayedRes[mapedPayedRes.length - 1].getTxId()
	return this.parseSubmitTxId(lastTxid)
}

//工具类
metaletUtils.parseSubmitTxId = function (res) {
	if (res?.txid) {
		res.txId = res.txid
	}
	return res
}

export default metaletUtils
