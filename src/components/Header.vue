<template>
	<div class="header-wrapper">
		<img class="logo" :src="logoUrl" @click="$router.push({ name: 'Buzz' })" />
		<img
			class="logo-xs"
			:src="logoUrlXs"
			@click="$router.push({ name: 'Buzz' })"
		/>
		<el-menu
			ref="refMenu"
			class="top-menu-list"
			active-text-color="#ffd04b"
			mode="horizontal"
			@select="menuItemClick"
		>
			<el-menu-item index="Buzz">{{
				$t('components_header_325')
			}}</el-menu-item>
			<el-menu-item index="Me" v-if="isLogin">{{
				$t('components_header_312')
			}}</el-menu-item>
			<template>
				<el-menu-item>
					<el-dropdown @command="handleLanCommand">
						<span class="el-dropdown-link">
							{{ currentLanguage
							}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="en_US">EN</el-dropdown-item>
							<el-dropdown-item command="zh_CN">中文</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-menu-item>
			</template>

			<el-menu-item class="login" index="Login" v-show="!isLogin">
				<template slot="title">
					<i class="el-icon-user"></i>
					<span>{{ $t('components_header_315') }}</span>
				</template>
			</el-menu-item>
			<el-menu-item class="login" v-show="isLogin">
				<template slot="title">
					<i class="el-icon-setting"></i>
					<el-dropdown @command="handleProfileCommand">
						<span class="el-dropdown-link">
							Profile<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="logout"
								><i class="el-icon-turn-off"></i
								>{{ $t('components_header_314') }}</el-dropdown-item
							>
							<el-dropdown-item command="setting"
								><i class="el-icon-s-custom"></i>Setting</el-dropdown-item
							>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import metaletUtils from '@/utils/wallet/metaletUtils'
import * as metaidv2api from '_r/metaidv2api.js'

export default {
	name: 'Header',
	data() {
		return {
			logoUrl: require('_a/images/common/logo_header.png'),
			logoUrlXs: require('_a/images/common/logo_header_xs.png'),
			currentTenant: null,
			dbFiles: [],
			currentDbFile: null
		}
	},
	computed: {
		...mapGetters([
			'isLogin',
			'username',
			'userConfig',
			'metaId',
			'currentWallet'
		]),
		showCsp() {
			//userConfig.blockChain == 'BSV'
			return false
		},
		showDisklet() {
			return (
				location.origin === 'https://metadisk.purem.cc' ||
				location.origin === 'http://localhost:8081'
			)
		},
		// 当前激活菜单的 index
		activeIndex() {
			const _activeIndex = this.$route.name || 'Home' //  获取当前路由名称
			//	console.log('---_activeIndex---', _activeIndex)
			//	console.log('location:', location.href)
			return _activeIndex
		},
		isProductEnv() {
			return (
				process.env.NODE_ENV !== 'development' &&
				location.origin === 'https://metadisk.purem.cc'
			)
		},
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		},
		avatar() {
			return this.metaId
				? 'https://showman.metaidservices.com/metafile/avatar/' +
						this.metaId +
						'?timestamp=' +
						new Date().getTime()
				: ''
		},
		shortMetaId() {
			return this.metaId ? 'MetaID:' + this.metaId.substr(0, 6) : ''
		},
		isInApp() {
			return window.appMetaIdJsV2
		},
		isViewOnly() {
			return this.$route.name == 'File' && this.$route.query.metaId != undefined
		},
		isShowMoney() {
			return this.currentWallet == this.$config.showMoney
		},
		isManagedWallet() {
			return this.currentWallet == this.$config.managedWallet
		},
		isDiskletWallet() {
			return this.currentWallet == this.$config.diskletWallet
		},
		isDiskWallet() {
			return this.currentWallet == this.$config.diskWallet
		},
		currentLanguage() {
			if (this.$i18n.locale == 'zh_CN') {
				return '中文'
			}
			return 'EN'
		}
	},
	watch: {
		activeIndex(newValue) {
			this.$refs.refMenu.activeIndex = newValue
		},
		async isLogin() {
			//这个必须要执行
			await window.$walletUtils.init()

			//this.$router.push('/buzz')
		},
		async userConfig() {}
	},
	created() {},
	mounted() {
		setTimeout(() => {
			this.checkWalletIsLogin()
		}, 1000)
		//console.log('this.$route.name ', this.$route)
		//this.$refs.refMenu.activeIndex = this.$route.name || 'Home'
	},
	methods: {
		handleAcccountsChanged() {
			this.onLogout()
			this.$message.warning('wallet account changed,please login again')
		},
		handleNetworkChanged() {
			this.onLogout()
			this.$message.warning('wallet network changed,please login again')
			setTimeout(() => {
				window.location.reload()
			}, 500)
		},
		handleLanCommand(command) {
			console.log('cmd', command)
			this.$i18n.locale = command
			localStorage.setItem('locale', command)
		},
		handleProfileCommand(command) {
			if (command == 'logout') {
				this.exitButton()
			}
			if (command == 'setting') {
				this.$router.push('/me')
			}
		},

		/**
		 * 退出登录
		 * @description 清除 cookie 存放的 token  并跳转到登录页面
		 */
		async exitButton() {
			this.loading = true

			window.metaidwallet.disconnect().then((res) => {
				this.loading = false

				if (!res || res?.status != 'ok') {
					return
				}
				this.$message.success(this.$t('components_header_322'))

				this.onLogout()
			})
		},

		onLogout() {
			//清理之前的登录信息
			this.$store.commit('changeIsLogin', false)
			this.$store.commit('changeUserInfoObj', null)
			if (window.metaidwallet) {
				window.metaidwallet.removeListener('accountsChanged')
				window.metaidwallet.removeListener('networkChanged')
			}
			this.$router.push({ name: 'Buzz' })
		},
		menuItemClick(key) {
			console.log('menuItemClick', key)
			if (key === 'Me') {
				this.$router.push({ name: key })
			} else if (key === 'Login') {
				this.loginMetalet()
			} else {
				this.$router.push({ name: key })
			}
		},
		async checkWalletIsLogin() {
			if (!window.metaidwallet) {
				return
			}

			const connectedRes = await window.metaidwallet.isConnected()
			if (connectedRes) {
				const address = await window.metaidwallet.getAddress()
				await this.afterConnectedWallet(address)
			}
		},
		async loginMetalet() {
			if (typeof window.metaidwallet == 'undefined') {
				this.$confirm(
					this.$t('components_header_326'),
					this.$t('components_header_319'),
					{
						confirmButtonText: this.$t('components_header_320'),
						cancelButtonText: this.$t('components_header_321'),
						type: 'success'
					}
				)
					.then(() => {
						window.open(
							'https://chromewebstore.google.com/search/metalet?hl=zh-CN&utm_source=ext_sidebar',
							'_blank'
						)
					})
					.catch(() => {})
				return
			}
			const connectRes = await window.metaidwallet.connect()
			if (!connectRes?.address) {
				return
			}
			await this.afterConnectedWallet(connectRes.address)
		},

		/** 连接上钱包后操作 */
		async afterConnectedWallet(address) {
			window.metaidwallet.on('accountsChanged', this.handleAcccountsChanged)
			window.metaidwallet.on('networkChanged', this.handleNetworkChanged)
			//设置钱包工具类
			window.$walletUtils = metaletUtils
			this.$store.dispatch(
				'changeCurrentWallet',
				window.$walletUtils.getCurrentWallet()
			)
			//检查metaid信息
			const metaidInfo = (await metaidv2api.getMetaidByAddress(address)) || {}

			if (!metaidInfo.name || metaidInfo.name.length == 0) {
				console.log('metaid name not exist')
			}

			await this.$store.dispatch('changeUserInfoObj', metaidInfo)

			this.$store.dispatch('changeIsLogin', true)

			//this.$message.success(this.$t('views_login_350'))
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';


.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.header-wrapper {
  width: 100%;
  padding: 0 20px;
  box-shadow: $tabBoxShadow;
  display: flex;

  .logo {
    margin: 14px 24px 0 24px;
    display: inline-block;
    height: 40px;
    cursor: pointer;
  }

  .logo-xs {
    display: none;
  }

  >>> .el-menu--horizontal {
    .el-menu-item:not(.is-disabled):hover {
      border-bottom-color: $Primary !important;
      background: $tabBackColor;
    }

    .external-link {
      padding: 0;
      a {
        display: block;
        padding: 0 20px;
      }
    }
  }

  .top-menu-list {
    flex: 1;

    .login, .register, .username, .exit, .user-exit-submenu {
      float: right;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 50%;
        font-size: 14px;
        color: #5a5e66;
        vertical-align: text-bottom;
      }
    }
  }
}
</style>
