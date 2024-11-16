<template>
	<div id="app">
		<Header v-if="isHeaderShow" id="headWrapper"></Header>
		<keep-alive>
			<router-view
				class="main-content"
				v-if="$route.meta.keepalive"
			></router-view>
		</keep-alive>
		<router-view v-if="!$route.meta.keepalive" />
		<Footer v-if="isFooterShow" v-show="false"></Footer>
		<el-backtop class="backtop" target="#app" :title="$t('app_1')"></el-backtop>
	</div>
</template>

<script>
import Header from '_c/Header.vue'
import Footer from '_c/Footer.vue'

export default {
	name: 'App',
	components: {
		Header,
		Footer
	},
	computed: {
		//  头部是否显示
		isHeaderShow() {
			let routerNameList = ['Error_401', 'Error_404', 'Error_500']
			return routerNameList.includes(this.$route.name) ? false : true
		},
		//  底部是否显示
		isFooterShow() {
			let routerNameList = ['Error_401', 'Error_404', 'Error_500']
			return routerNameList.includes(this.$route.name) ? false : true
		}
	},
	mounted() {
		const that = this
		window.addEventListener('resize', function () {
			return (() => {
				that.$store.commit('changeScreenWidth', document.body.clientWidth)
			})()
		})
		document
			.querySelector('meta[name="keywords"]')
			.setAttribute('content', this.$config.siteName)
	}
}
</script>
<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

#app {
  height: 100%;
  overflow-x: hidden;
  -webkit-text-size-adjust: none;
  overflow-y: auto;
  >>> .el-backtop {
    background-color: $Success;
    color: #fff;
    z-index: 3;
  }
  .main-content {
    flex: 1;
    width: 90%;
    min-height: calc(100vh - 70px);
    margin: 0 auto;
    display: flex;
  }
}
</style>
