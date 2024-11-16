import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from '@/store/index.js'

import '_a/styles/base.styl'
import '_a/styles/iconfont/iconfont.css'
import '_a/styles/iconfontCover.styl'
import '_a/styles/elementCover.styl'
import '_a/styles/mediaScreenXs.styl'
import '@/router/before.js'
import 'element-ui/lib/theme-chalk/index.css'
import i18n from './lang'
// 引入全局函数
import globalFunction from '@/libs/globalFunction/index.js'
// 引入 Element UI 组件
import element from '@/plugins/element.js'
//import element from 'element-ui'
// 引入自定义的全局配置
import config from '@/config/index.js'

import uploader from '@/components/vue-uploader/'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.config.productionTip = false

for (let key in globalFunction) {
	Vue.prototype[`$${key}`] = globalFunction[key]
}

Vue.use(element, {
	i18n: (key, value) => i18n.t(key, value) // 这里会根据选的语言切换Element-ui的语言
})

Vue.prototype.$config = config
Vue.use(uploader)

Vue.directive('focus', {
	// 当被绑定的元素插入到 DOM 中时……
	inserted: function (el) {
		// 聚焦元素
		console.log(el.children[0])
		el.children[0].focus()
	}
})

new Vue({
	router,
	store,
	i18n,
	render: (h) => h(App)
}).$mount('#app')
