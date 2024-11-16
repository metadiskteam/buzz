<template>
	<div class="contain">
		<div class="center-contain">
			<div
				class="search-center"
				:class="screenWidth > 768 ? 'webWidth' : 'h5Width'"
			>
				<el-tag
					class="buzzTypeTag"
					style="cursor: pointer"
					@click="buzzTypeClick(item)"
					v-for="item in buzzTypeItems"
					:key="item.label"
					:type="item.type"
					:effect="item.effect"
				>
					{{ item.label }}
				</el-tag>
				<el-button
					style="padding-left: 20px; color: #e68611"
					type="text"
					icon="el-icon-edit-outline"
					@click="newBuzzClick()"
					>{{ $t('buzz_004') }}</el-button
				>
				<el-button
					v-if="false"
					v-show="screenWidth > 768"
					style="padding-left: 20px"
					type="text"
					icon="el-icon-refresh"
					@click="refreshClick()"
					>{{ $t('me_022') }}</el-button
				>
			</div>

			<NewBuzzList v-show="buzzType.type == 'New'" ref="NewBuzzRef" />

			<FolloBuzzList v-show="buzzType.type == 'Follow'" ref="FollowBuzzRef" />

			<NewBuzzDialog
				:visible.sync="showNewBuzzDialog"
				@newBuzzSuccess="newBuzzSuccess"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import NewBuzzList from './newBuzzList'
import FolloBuzzList from './followBuzzList'
import NewBuzzDialog from './dialogs/newBuzzDialog'

export default {
	components: { NewBuzzList, FolloBuzzList, NewBuzzDialog },
	data() {
		return {
			showNewBuzzDialog: false,
			buzzTypeItems: [
				{
					authType: false,
					label: 'NewBuzz',
					effect: 'dark',
					type: 'New'
				},
				{
					authType: true,
					label: 'Following',
					effect: 'plain',
					type: 'Follow'
				}
			],
			buzzType: {
				authType: false,
				label: 'New',
				effect: 'dark',
				type: 'New'
			}
		}
	},
	async mounted() {},
	methods: {
		buzzTypeClick(inputItem) {
			this.buzzTypeItems.forEach((item) => {
				item.effect = 'plain'
			})
			inputItem.effect = 'dark'
			this.buzzType = inputItem
			if (this.buzzType.type == 'New') {
				this.$refs.FollowBuzzRef.removeScrollEvent()
				this.$refs.NewBuzzRef.initScrollEvent()
			}
			if (this.buzzType.type == 'Follow') {
				this.$refs.NewBuzzRef.removeScrollEvent()
				this.$refs.FollowBuzzRef.initScrollEvent()
			}
			this.refreshClick()
		},
		newBuzzClick() {
			if (!this.isLogin) {
				this.$message.success(this.$t('views_login_1'))
				return
			}
			this.showNewBuzzDialog = true
		},
		newBuzzSuccess() {
			console.log('newBuzzSuccess got')
			this.refreshClick()
		},
		refreshClick() {
			if (this.buzzType.type == 'New') {
				this.$refs.NewBuzzRef.resetQuery()
			}
			if (this.buzzType.type == 'Follow') {
				this.$refs.FollowBuzzRef.resetQuery()
			}
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
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		}
	}
}
</script>

<style lang="stylus" scoped>
.contain{
  width: 100vw;


  .center-contain {
    margin: 0px auto;


    .search-center {

    }
    .webWidth{
      width: 700px;
    }
    .h5Width{
      width: 20rem;
      display: flex;
      align-items: columns
    }
    margin-top: 15px;
    left: auto;
    float: center;
    .buzzTypeTag{
      font-size: 18px;
      margin-right:10px
      width:10rem;
    }
  }
}
</style>
