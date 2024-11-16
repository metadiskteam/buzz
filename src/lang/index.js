// lang文件夹下index.js
//https://blog.csdn.net/cnfabu/article/details/126856366
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
import en from './en' //英文
import zh from './zh-CN' //中文
//import ja from './ja'  //日文
Vue.use(VueI18n)

const messages = {
	zh_CN: {
		language: '简体中文',
		...zh,
		...zhLocale
	},
	en_US: {
		language: 'English',
		...en,
		...enLocale
	}
}
const i18n = new VueI18n({
	//默认为中文
	locale: localStorage.getItem('locale') || 'en_US', // 语言类型存储到localstorage里
	fallbackLocale: 'en_US',
	messages
})

locale.i18n((key, value) => i18n.t(key, value))
// 导出messages 给切换语言的时候用
export default i18n
