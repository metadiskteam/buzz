import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'Home',
			redirect: '/buzz',
			meta: {
				title: 'MetaDisk|Buzz',
				content: {
					description: 'MetaDisk-Buzz'
				}
			}
		},
		{
			path: '/buzz',
			name: 'Buzz',
			component: () => import(/* webpackChunkName: "Buzz" */ '_v/Buzz.vue'),
			meta: {
				keepalive: true,
				requireAuth: false, //  当前路由是否需要登录才可进入
				title: 'MetaDisk|Buzz',
				content: {
					description: 'MetaDisk-Buzz'
				}
			}
		},
		{
			path: '/buzz/:id',
			name: 'BuzzDetail',
			component: () =>
				import(/* webpackChunkName: "BuzzDetail" */ '_v/BuzzDetail.vue'),
			meta: {
				requireAuth: false, //  当前路由是否需要登录才可进入
				title: 'buzzDetail',
				content: {
					description: 'buzzDetail'
				}
			}
		},
		{
			path: '/buzz/user/:address',
			name: 'BuzzUser',
			component: () =>
				import(/* webpackChunkName: "BuzzUser" */ '_v/BuzzUser.vue'),
			meta: {
				requireAuth: false, //  当前路由是否需要登录才可进入
				title: 'buzzUser',
				content: {
					description: 'buzzUser'
				}
			}
		},
		{
			path: '/me',
			name: 'Me',
			component: () => import(/* webpackChunkName: "Market" */ '_v/Me.vue'),
			meta: {
				requireAuth: true, //  当前路由是否需要登录才可进入
				title: 'MetaDisk|Me',
				content: {
					description: 'MetaDisk-Me'
				}
			}
		},
		{
			path: '*',
			name: 'Error_404',
			component: () =>
				import(/* webpackChunkName: "error_404" */ '_v/ErrorPage/404.vue'),
			meta: { title: 'Link does not exist' }
		}
	]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err)
}
