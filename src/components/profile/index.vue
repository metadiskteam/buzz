<template>
	<div class="contain">
		<el-row :gutter="20">
			<el-col :span="6" :xs="24">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>{{ $t('me_001') }}</span>
					</div>
					<div>
						<div class="text-center">
							<userAvatar :user="userConfig" />
						</div>
						<ul class="list-group list-group-striped">
							<li class="list-group-item">
								<i class="el-icon-user" />{{ $t('me_002') }}
								<div class="pull-right" v-if="userConfig.name">
									{{ userConfig.name }}
									<el-button
										style=""
										size="mini"
										type="primary"
										icon="el-icon-edit"
										@click="settingNickname"
										>setting</el-button
									>
								</div>
								<div class="pull-right" v-else>
									<el-button
										style=""
										size="mini"
										type="primary"
										icon="el-icon-edit"
										@click="settingNickname"
										>setting</el-button
									>
								</div>
							</li>
							<li class="list-group-item">
								<i class="el-icon-phone" />{{ $t('me_044') }}
								<div class="pull-right">{{ userConfig.mobile }}</div>
							</li>
							<li class="list-group-item">
								<i class="el-icon-message" />{{ $t('me_003') }}
								<div class="pull-right">{{ userConfig.email }}</div>
							</li>

							<li class="list-group-item">
								<i class="el-icon-date" />{{ $t('me_028') }}
								<div class="pull-right">
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
								</div>
							</li>

							<li class="list-group-item-blank">
								<center>
									<el-button
										v-if="userConfig"
										v-loading.fullscreen.lock="loading"
										style="width: 100px"
										type="warning"
										size="small"
										@click="exitButton"
										>{{ $t('components_header_314') }}</el-button
									>
								</center>
							</li>
						</ul>
					</div>
				</el-card>
			</el-col>
			<el-col :span="18" :xs="24">
				<el-card>
					<div slot="header" class="clearfix">
						<span>{{ $t('me_005') }}</span>
					</div>
					<el-tabs v-model="activeTab">
						<el-tab-pane name="metaidUserInfo" label="MetaID">
							<metaidInfo :user="userConfig" />
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import metaidInfo from './metaidInfo'
import userAvatar from './userAvatar'

import { mapGetters } from 'vuex'

export default {
	name: 'Profile',
	components: {
		metaidInfo,
		userAvatar
	},
	data() {
		return {
			loading: false,
			roleGroup: {},
			postGroup: {},
			activeTab: 'metaidUserInfo',
			//activeTab: 'userinfo',
			showTransferCoin: false
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
		currentLanguage() {
			if (this.$i18n.locale == 'zh_CN') {
				return '中文'
			}
			return 'EN'
		}
	},
	async created() {
		//await this.getUser()
		//await this.loadMetaidUserInfo()
	},
	methods: {
		settingNickname() {
			this.$prompt('please input nickname', {
				inputValidator(value) {
					if (value == undefined) {
						return 'nickname can not be empty'
					} else if (value.trim().length == 0) {
						return 'nickname can not be empty'
					}
				}
			}).then(({ value }) => {
				this.submitSettingNickname(value)
			})
		},
		async submitSettingNickname(nickname) {
			let opReturnFieldList = [
				Buffer.from('metaid'),
				Buffer.from('create'),
				Buffer.from('/info/name'),
				Buffer.from('0'),
				Buffer.from('1.0.0'),
				Buffer.from(`text/plain;utf8`),
				Buffer.from(nickname)
			]
			const res = await window.$walletUtils.createPin(opReturnFieldList)
			if (res) {
				this.userConfig.name = nickname
				await this.$store.dispatch('changeUserInfoObj', this.userConfig)
				this.$message({
					type: 'success',
					message: 'success'
				})
			}
		},
		handleLanCommand(command) {
			this.$i18n.locale = command
			localStorage.setItem('locale', command)
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

				//清理之前的登录信息
				this.$store.commit('changeIsLogin', false)
				this.$store.commit('changeUserInfoObj', null)

				setTimeout(() => {
					this.$router.push({ name: 'Buzz' })
				}, 100)
			})
		},

		setActiveTab(activeTab) {
			this.activeTab = activeTab
		}
	}
}
</script>

<style lang="stylus" scoped>
.contain{
  width: 100%;
  border: 1px solid #eee;
  padding: 10px;

  .box-card {
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
  }
  .clearfix {
    &:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    }
  }

  .list-group-striped > .list-group-item {
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
    height: 50px;
  }

  .list-group {
    padding-left: 0px;
    list-style: none;
  }

  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 15px 0px;
    font-size: 13px;
  }

  .list-group-item-blank{
    margin-top: 20px;
    height: 201px;
  }

  .pull-right {
    float: right !important;
  }
}
</style>
