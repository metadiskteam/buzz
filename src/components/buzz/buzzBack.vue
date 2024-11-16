<template>
	<div v-if="showBack" class="showBack">
		<el-button type="text" icon="el-icon-back" @click="goBack">Back</el-button>
		<span style="padding-left: 6rem"></span>
		<el-button
			v-if="isLogin"
			v-show="!followed"
			style="background-color: rgb(109, 244, 13)"
			type="waring"
			size="mini"
			round
			@click="follow()"
			>follow</el-button
		>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as metaidv2api from '_r/metaidv2api.js'

export default {
	name: 'BuzzBack',
	props: {
		showBack: {
			required: false,
			default: false,
			type: Boolean
		},
		followingMetaId: {
			require: true,
			type: String
		}
	},
	components: {},
	data() {
		return {
			followed: false
		}
	},
	created() {},
	async mounted() {
		this.checkFollow()
	},
	computed: {
		...mapGetters([
			'isLogin',
			'username',
			'userConfig',
			'metaId',
			'currentWallet'
		]),
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		}
	},
	methods: {
		async checkFollow() {
			if (this.metaId) {
				//同一个人
				if (this.metaId == this.followingMetaId) {
					this.followed = true
					return
				}
				const followRecord = await metaidv2api.getFollowRecord(
					this.followingMetaId,
					this.metaId
				)
				//有code属性则表示没有找到记录
				if (followRecord.metaId) {
					this.followed = true
				}
			}
		},
		async follow() {
			if (!this.isLogin) {
				this.$message.success(this.$t('views_login_1'))
				return
			}
			const followRecord = await metaidv2api.getFollowRecord(
				this.followingMetaId,
				this.metaId
			)
			//有code属性则表示没有找到记录
			if (followRecord.metaId) {
				this.$message.success('followed')
				return
			}
			const res = await window.$walletUtils.following(this.followingMetaId)
			if (res) {
				this.$message.success(this.$t('csp_026'))
			}
		},
		goBack() {
			history.back(-1)
			//this.$router.push({ path: '/buzz' })
		}
	}
}
</script>
<style lang="stylus" scoped>

.buzzContent{
  .showBack{
    margin-bottom: .1rem;
    border-bottom: 1px solid #eee;
  }


 .quoteBuzz{


    border: 1px solid #eee;
    margin-left: 2.5rem;

    margin-top:.8rem;
  }
}
</style>
