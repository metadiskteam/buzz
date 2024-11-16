export default {
	state: {
		isLogin: false, //  用户登录状态
		avatar: '',
		currentWallet: null,
		userInfoObj: {} //  用户信息
	},
	mutations: {
		SET_AVATAR: (state, avatar) => {
			state.avatar = avatar
		},
		/**
		 * 保存登录状态
		 * @param {object} state Vuex 的 state 对象
		 * @param {boolean} data 登录状态
		 */
		changeIsLogin(state, data) {
			state.isLogin = data
		},
		/**
		 * 保存用户信息
		 * @param {object} state Vuex 的 state 对象
		 * @param {boolean} data 用户信息
		 */
		changeUserInfoObj(state, data) {
			state.userInfoObj = Object.assign({}, state.userInfoObj, data)
		},
		/**
		 * 设置当前钱包
		 * @param {object} state
		 * @param {String} data
		 */
		currentWallet(state, data) {
			state.currentWallet = data
		}
	},
	actions: {
		changeIsLogin(context, isLogin) {
			context.commit('changeIsLogin', isLogin)
		},
		changeUserInfoObj(context, user) {
			//console.log('--------changeUserInfoObj-----',user)
			context.commit('changeUserInfoObj', user)
			if (user.avatar) {
				context.commit('SET_AVATAR', user.avatar)
			}
		},
		changeCurrentWallet(context, data) {
			context.commit('currentWallet', data)
		}
	}
}
