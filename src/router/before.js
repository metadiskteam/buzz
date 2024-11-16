import router from '@/router/router'
import store from '@/store/index.js'
import config from '@/config/index.js'

// 路由全局前置守卫
router.beforeEach((to, from, next) => {
	// 当前路由需要登录才可进入
	if (to.matched.some((m) => m.meta.requireAuth)) {
		if (store.getters.isLogin) {
			next() // 正常跳转
		} else {
			next({
				path: '/buzz'
			})
		}
	} else {
		// 正常跳转
		next()
	}

	// 路由发生变化修改浏览器标签 title
	if (to.meta.title) {
		document.title =
			to.name === 'Home'
				? `${config.siteName} - ${to.meta.title}`
				: `${to.meta.title} - ${config.siteName}`
	}
	// 路由发生变化修改页面 meta 描述信息
	if (to.meta.content) {
		let head = document.getElementsByTagName('head')
		let meta = document.createElement('meta')
		document
			.querySelector('meta[name="description"]')
			.setAttribute('content', to.meta.content.description)
		meta.content = to.meta.content
		head[0].appendChild(meta)
	}
})
