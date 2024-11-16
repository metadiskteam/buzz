<template>
	<div class="buzzContent">
		<BuzzBack
			v-if="showBack"
			:showBack="showBack"
			:followingMetaId="buzz.metaid"
		/>

		<BuzzItemInner key="buzzItem" :item="buzz" @resetQuery="resetQuery" />
		<div class="quoteBuzz" v-if="quoteBuzz">
			<BuzzItemInner
				key="quoteBuzzItem"
				:item="quoteBuzz"
				:isQuote="true"
				@resetQuery="resetQuery"
			/>
		</div>
	</div>
</template>

<script>
import BuzzItemInner from './buzzItemInner'
import BuzzBack from './buzzBack'
export default {
	name: 'BuzzItem',
	props: {
		// 文件类型
		buzz: {
			required: true,
			type: Object
		},
		quoteBuzz: {
			required: false,
			type: Object
		},
		showBack: {
			required: false,
			default: false,
			type: Boolean
		}
	},
	components: { BuzzItemInner, BuzzBack },
	data() {
		return {}
	},
	created() {},
	async mounted() {},
	computed: {},
	methods: {
		resetQuery() {
			console.log('buzzitem-resetQuery')
			this.$emit('resetQuery')
		},

		follow() {},
		goBack() {
			//history.back(-1)
			this.$router.push({ path: '/buzz' })
		}
	}
}
</script>
<style lang="stylus" scoped>

.buzzContent{
  .showBack{
    margin-bottom: .1rem;
  }

 .quoteBuzz{
    border: 1px solid #eee;
    margin-left: 2.5rem;
    margin-top:.8rem;
    background-color: #f8f8f8;
  }


}
</style>
