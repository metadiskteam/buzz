<template>
	<div class="buzzContent">
		<el-skeleton :loading="loading" animated>
			<template slot="template">
				<div style="padding: 1px">
					<el-skeleton-item variant="h3" style="width: 30%" />
					<div
						style="
							display: flex;
							align-items: center;
							justify-items: space-between;
							margin-top: 16px;
							height: 16px;
						"
					>
						<el-skeleton-item variant="text" style="width: 35%" />
						<el-skeleton-item variant="text" style="width: 30%" />
					</div>
				</div>
			</template>
			<template>
				<div class="item-list">
					<el-card
						class="card-box"
						v-for="item in buzzList"
						:key="item.txId"
						:body-style="{ padding: '5px' }"
					>
						<BuzzItem
							:buzz="item"
							:quoteBuzz="item.quoteBuzz"
							@resetQuery="resetQuery"
						/>
					</el-card>
				</div>
			</template>
		</el-skeleton>

		<div class="loadMore" align="center">
			<el-button plain @click="loadNext()" v-if="canLoadNext">{{
				$t('views_market_362')
			}}</el-button>
			<p v-if="!canLoadNext">{{ $t('views_market_363') }}</p>
		</div>
	</div>
</template>

<script>
import * as metaidv2api from '_r/metaidv2api.js'
import metaidv2Utils from '@/utils/metaidv2Utils.js'
import BuzzItem from './buzzItem'
import { mapGetters } from 'vuex'

export default {
	name: 'FollowBuzzList',
	components: { BuzzItem },
	props: {},
	data() {
		return {
			canLoadNext: true,
			buzzList: [],
			loading: false,
			loadingNext: false,
			// 分页数据
			pageData: {
				currentPage: 1,
				pageCount: 5,
				total: 0
			}
		}
	},
	created() {},
	async mounted() {
		//this.initScrollEvent()
		//this.queryBuzzList()
	},
	// 监听路由地址变化，当地址不在当前页面时，移除监听器
	watch: {
		isLogin() {
			this.resetQuery()
		},
		$route(to, from) {
			if (to.path !== from.path) {
				const appElement = document.getElementById('app')
				appElement.removeEventListener('scroll', this.scrollListener)
			}
		}
	},

	destroyed() {
		// 移除滚动事件监听器
		const appElement = document.getElementById('app')
		appElement.removeEventListener('scroll', this.scrollListener)
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
		initScrollEvent() {
			// 获取 #app 元素的引用
			const appElement = document.getElementById('app')

			// 添加滚动事件监听器
			appElement.addEventListener('scroll', this.handleScroll)
			// 如果需要在组件销毁时移除监听器，可以将其存储在实例上以便访问
			this.scrollListener = this.handleScroll
		},
		// 滚动到底部时继续加载列表
		handleScroll(event) {
			const { scrollTop, scrollHeight, clientHeight } = event.target
			this.isBottom = scrollTop + clientHeight >= scrollHeight - 1

			if (this.isBottom && this.canLoadNext) {
				this.loadNext()
				// 执行加载更多内容等操作
			}
		},
		// 移除监听器函数
		removeScrollEvent() {
			const appElement = document.getElementById('app')
			appElement.removeEventListener('scroll', this.scrollListener)
		},
		loadNext() {
			this.pageData.currentPage = this.pageData.currentPage + 1
			this.loadingNext = true
			this.queryBuzzList()
		},
		goUserHome(item) {
			console.log('soon', item)
			///this.$router.push({ path: '/buzz/user/' + item.metaid })
		},
		resetQuery() {
			this.pageData.currentPage = 1
			this.buzzList = []
			this.queryBuzzList()
		},
		async queryBuzzList() {
			const followingList = await metaidv2api.getFollowingList(
				this.metaId,
				0,
				1000
			)
			if (!followingList.list || followingList.list.length < 1) {
				this.canLoadNext = false
				return
			}

			const p = {
				page: this.pageData.currentPage,
				size: this.pageData.pageCount,
				path: '/protocols/simplebuzz,/protocols/banana',
				metaidList: followingList.list
			}
			const buzzListRes = await metaidv2api.getAllPinByPathAndMetaId(p)
			this.loading = false

			if (buzzListRes?.list?.length > 0) {
				for (let i = 0; i < buzzListRes.list.length; i++) {
					const item = buzzListRes.list[i]

					await metaidv2Utils.handleBuzz(item)

					this.buzzList.push(item)
				}

				this.loadingNext = false
				this.canLoadNext = this.buzzList.length < buzzListRes.total
				this.pageData.total = buzzListRes.total
			} else {
				this.canLoadNext = false
			}
		}
	}
}
</script>
<style lang="stylus" scoped>

.buzzContent{

  .loadMore{
    margin-top: 5px;
    margin-bottom: 30px;
  }

  .noBuzzData{
    margin-top: 5px;
    margin-bottom: 30px;
  }
  .item-list{
    padding-top: 1rem;
    display: flex
    flex-direction: column;
    flex-wrap:wrap;
    justify-content: flex-end;

    .card-box{
      margin-bottom: .6rem;
    }
  }
}
</style>
