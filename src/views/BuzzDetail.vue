<template>
	<div class="main-content">
		<div v-if="item != null">
			<div class="item-list">
				<el-card class="card-box" :body-style="{ padding: '5px' }">
					<BuzzItem :showBack="true" :buzz="item" :quoteBuzz="item.quoteBuzz" />
				</el-card>
			</div>
			<div v-if="item.commentCount > 0">
				<div class="commentBuzzCount">Comments({{ item.commentCount }})</div>
				<div class="commentBuzzlist">
					<el-card
						class="card-box"
						v-for="commentBuzz in item.commentList"
						:key="commentBuzz.txId"
						:body-style="{ padding: '5px' }"
					>
						<BuzzItemInner
							key="commentBuzzItem"
							:item="commentBuzz"
							:isComment="true"
						/>
					</el-card>
				</div>
			</div>
		</div>

		<div v-else>loading...</div>
	</div>
</template>

<script>
import BuzzItem from '_c/buzz/buzzItem'
import BuzzItemInner from '_c/buzz/buzzItemInner'
import * as metaidv2api from '_r/metaidv2api.js'
import metaidv2Utils from '@/utils/metaidv2Utils.js'

export default {
	name: 'BuzzDetail',
	components: { BuzzItem, BuzzItemInner },
	data() {
		return {
			item: null
		}
	},
	created() {},
	async mounted() {
		this.queryOneBuzz()
	},
	methods: {
		async queryOneBuzz() {
			const item = await metaidv2api.queryOneBuzz(this.id)

			await metaidv2Utils.handleBuzz(item)

			this.item = item
		}
	},

	computed: {
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		},
		id() {
			return this.$route.params.id
		}
	},
	watch: {
		// 如果路由有变化，会再次执行该方法
		$route: 'queryOneBuzz'
	}
}
</script>
<style lang="stylus" scoped>
.main-content  {
  display:block  !important;

  .item-list{
    padding-top: 1rem;

    .card-box{
      margin-bottom: .6rem;
    }
  }

  .commentBuzzCount{
    margin-top:.8rem;
  }
  .commentBuzzlist{
    border: 1px solid #1df;
    margin-left: .2rem;
    margin-top:.8rem;
    background-color: #f8f8f8;
  }
}
</style>
