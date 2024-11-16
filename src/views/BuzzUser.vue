<template>
	<div class="main-content">
		<div v-loading="loading"></div>
		<div class="buzzBack">
			<BuzzBack
				:showBack="true"
				v-if="metaidInfo"
				:followingMetaId="metaidInfo.metaid"
			/>
		</div>
		<div class="userInfo" v-if="metaidInfo && metaidInfo.metaid">
			<div class="metaid">
				MetaID
				<span v-if="screenWidth > 768">{{ metaidInfo.metaid }}</span>
				<span v-else>{{ metaidInfo.metaid.substr(0, 6) }}</span>
			</div>
			<div class="followinfo">
				<p class="followingList" @click="followingListClick">
					{{ followingList.length }} following
				</p>
				|
				<p class="followerList" @click="followerListClick">
					{{ followerList.length }} followers
				</p>
			</div>
		</div>
		<div class="item-list">
			<UserBuzzList v-if="address" :address="address" />
		</div>
	</div>
</template>

<script>
import UserBuzzList from '_c/buzz/userBuzzList'
import BuzzBack from '_c/buzz/buzzBack'
import * as metaidv2api from '_r/metaidv2api.js'

export default {
	name: 'BuzzUser',

	components: { UserBuzzList, BuzzBack },
	data() {
		return {
			loading: false,
			metaidInfo: null,
			followingList: [],
			followerList: []
		}
	},
	created() {},
	async mounted() {
		this.getMetaidByAddress()
	},
	methods: {
		followingListClick() {},
		followerListClick() {},
		async getMetaidByAddress() {
			this.loging = true
			this.metaidInfo = await metaidv2api.getMetaidByAddress(this.address)

			const followingList = await metaidv2api.getFollowingList(
				this.metaidInfo.metaid,
				0,
				1000
			)
			if (followingList.list) this.followingList = followingList.list
			const followerList = await metaidv2api.getFollowerList(
				this.metaidInfo.metaid,
				0,
				1000
			)
			if (followerList.list) this.followerList = followerList.list
			this.loading = false
		}
	},

	computed: {
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		},
		address() {
			return this.$route.params.address
		}
	}
}
</script>
<style lang="stylus" scoped>
.main-content  {
  display:block  !important;

  .buzzBack{
    padding-top: 1rem;
  }
  .userInfo{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    .followinfo{
      color: #999;
      font-size: 16px;
      display: flex;

      .followingList{
        margin-right: .3rem;
        cursor: pointer;
      }
      .followerList {
        margin-left: .3rem;
        cursor: pointer;
      }
    }
  }
}
</style>
