<template>
	<div v-if="user">
		<el-form size="mini" label-width="100px">
			<el-form-item label="metaid">
				{{ user.metaid }}
			</el-form-item>
			<el-form-item label="name">
				{{ user.name }}
			</el-form-item>
			<el-form-item label="following">
				{{ followingList.length }} following
			</el-form-item>
			<el-form-item label="follower">
				{{ followerList.length }} followers
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import * as metaidv2api from '_r/metaidv2api.js'

export default {
	props: {
		user: {
			type: Object
		}
	},
	data() {
		return {
			followingList: [],
			followerList: []
		}
	},
	created() {},
	async mounted() {
		this.followInfo()
	},
	methods: {
		close() {
			this.$tab.closePage()
		},
		async followInfo() {
			const followingList = await metaidv2api.getFollowingList(
				this.user.metaid,
				0,
				1000
			)
			this.followingList = followingList.list
			const followerList = await metaidv2api.getFollowerList(
				this.user.metaid,
				0,
				1000
			)
			this.followerList = followerList.list
		}
	}
}
</script>
