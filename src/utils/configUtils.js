let configUtils = {}

import config from '@/config/index.js'

configUtils.getFeeRate = function (blockChain) {
	let configFeeRate = localStorage.getItem('config-feeRate$' + blockChain)
	if (!configFeeRate) {
		configFeeRate = config.defaulteFeeRate[blockChain]
		if (!configFeeRate) {
			configFeeRate = config.feeRate
		}
	}
	return configFeeRate
}

export default configUtils
