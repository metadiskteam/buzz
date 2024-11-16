import Vue from 'vue'
import Vuex from 'vuex'

import common from './module/common' //  公共模块
import user from './module/user' //  用户模块

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		//
	},
	getters: {
		avatar: (state) => state.user.avatar,
		userConfig: (state) => state.user.userInfoObj,
		currentWallet: (state) => state.user.currentWallet,
		// 用户姓名
		username: (state) => state.user.userInfoObj.name,
		// 用户ID
		metaId: (state) =>
			state.user.userInfoObj.metaId || state.user.userInfoObj.metaid,
		// 登录状态
		isLogin: (state) => state.user.isLogin
	},
	mutations: {
		//
	},
	actions: {
		//
	},
	modules: {
		common,
		user
	}
})
