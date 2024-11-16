/**
 * 存放工程配置项
 */
const config = {
	/**
	 * @description 域名
	 *              区分生产环境和开发环境，用来存放session及一些用户配置信息（左侧菜单栏是否收缩等）
	 *              冒号之前配置生产环境域名
	 *              冒号之后配置开发环境域名，开发环境域名默认使用主机名
	 */
	domain:
		process.env.NODE_ENV === 'production'
			? location.host.indexOf('.metadisk.cc') !== -1
				? '.metadisk.cc'
				: ''
			: location.hostname,
	siteName: 'MetaDisk',
	baseContext: '/',
	LocalTest: process.env.NODE_ENV === 'production' ? false : false,
	metaletWallet: 'metaletWallet',

	blockChain_MVC: 'MVC',

	blockChainNetwork:
		process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
	blockChainCoin: 'space',
	feeRate: 0.25,
	defaulteFeeRate: {
		MVC: 0.25
	},
	serviceFeeMinSatoshis: 1024,
	servicePercent: 0.1
}

export default config
