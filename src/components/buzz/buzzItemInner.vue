<template>
	<div class="buzzContent">
		<p
			class="buzzHtml"
			@click="toDetail(item)"
			v-html="item.summary.replace(/\n/g, '<br/>')"
		></p>
		<div class="buzzImgList">
			<el-image
				v-for="attachmentsUrl in attachmentsUrls"
				:key="attachmentsUrl"
				class="buzzImgItem"
				style="width: 200px; height: 200px"
				:src="attachmentsUrl"
				:preview-src-list="attachmentsUrls"
			>
			</el-image>
		</div>

		<div class="item_operation" v-if="item.metaidInfo">
			<div class="item_operation_user" @click="goUserHome(item)">
				<div
					class="avatarWrap"
					style="height: 50px; width: 50px; margin-right: 5px"
				>
					<img
						v-if="item.metaidInfo.avatar"
						class="avatar"
						:src="
							`${manHost}${item.metaidInfo.avatar}?timestamp=` +
							new Date().getTime()
						"
						alt=""
					/>
					<img v-else class="avatar" :src="defaultUserUrl" alt="" />

					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAABZBJREFUeF7tnY211DYQhdkKEirIUkGgApYKAhVk6YBUwFJB0kFeKghUkPcqCFSQTQWBCsK9IL/4bNbSSBrZ2vX1OTp5ZK3x+H4ejfVje/MvtgfaulFgIyDdsPjiiID0xUNAOuMhIALSmwKd+dNrDrmDTsdQKNl7lI+DdpvN5taiI25YdqP9vsXfj8O/t/gvy1OLnTn3WRrIJ5wsxWWh6O8h9r3wcwgBaAMowiJAlm/mOPa5YywB5AMcuSEEiE8I3W2ANMDZw7nv53RwLiB/46R+QXkLCMc5T7D2WICzhY3nKK9Qvqu1l6rfGghzwcHa5qecXfr3kJMO8KNZ7mkFhM3Sq2sBcXohBDCMePfmrAWQNwDBq+jqN4Dheb72PFFPIIyK55eWI2rFDDnmrVe0eAF5B4f2c9+y1orpVT/cOt/A3g+1Nj2A/AYQ+1pHrqE+wBDKjzXnUgtEME7Ur4VSA+QdIoP359r+D4U5paj5KgXCBL5ba85IXYEhp9yWJPoSIBx/ery2u6kUhNPfw93XX7n1SoCspp+RK+YZKAf8v6x+Si6QD4iMYQi71t9V1EekcADV3KPPBfLsWodDWl0dYZjlD6v9HCB3gLGzGtZ+/ykAKEzwpgHJHCCKjsKrDEDYPfjdUt0KRLnDomZkH0A54ufkfIoVyE9orjjcrK1QAQDhBNfPqepWII/U70hJGf/d2i+xAFFzVcfivrblFtgCRM2VH5Bks2UB8qTX1SFOOs1mJqxm+TN2wBSQT4DBdUvanBQAFK47m1z3lQKiIXYnEIMZAIkOzaeAKH/4A4nmkRQQ9c79gexgcnJsKwXkoSahfImk+iNRIICx8XVH1qhA7DHCGBCN7ja6fmKjvzEgWlHSDsjknVYMiKZq2wE5wPTZqV0BaSR6zGxsTXAMyAvkdIaWNmcFAGQPk7+eMxsDoj6IM4hRb32yLyIgjURPNFlFQDTK2whWbCXKZISoU9iIxteOIUfQ/8nKIQLSDkist64Iaav7pPWp4RMBEZCFFOjssIoQAelMgc7cUYQISGcKdOaOIuTSgcB/DZ00glg0dAJfNNorII0U6MxsaYRogqoRyNIJKs2ptwNygGnNqTfSN9ts6Zy6lgFlS22rEFtwrYVyNg1d9ypdKPdAk1SuHO6NlS4lpQEttnZmUrXYWp1DZxowl3rVRupxBD2w48wk9bx6CogeafMHUvVI20ck9ofOPq3aHCKEy38mH6RNRQjF06iv0yXk8Vg0XVEe8QPi8uIAftPjiZNPqzaDCOFLA6Jv5LM0WRRRL5+pvJRS/Y/BvBWImq16IMnmioewAjmi2XpU6dOqqyNC+MrYbUoEKxDa0ZRuSs2J3wHD/RV/PBS/GfWs0KdVVwMQvrlhZxEhJ0IUJRZFT/ZJjV2dmswFolvgTCiWW92xyVwgrKu5diOU2FTtlIkSILSlfkkCimWY5JyJUiB8nznvumb9Kqfxwlx8t/AMIRN59nvyS4HwpPmRyBeLn32HDgAI32Jd9LGbGiCU4gZQXnaoyWIuAQbf0LAvdaAWiKCMlK+FQVMeQL40Xygv15pTQs5gZBQ1U+No8gJCm0z0XA98LA3XS6wX7qYIIzuBnztfTyCDfX6M+M0lipvrM2Bwfe4ht15s/xZAhmjhkP2tp7O92ArDIfzSgUtUtGqyzulFIOzZXwUYgOC3CTmvsWt1cbSKkFN/mVf4/REuK7qoHBNm+gYQ21YgBrtzARmfB5P/Dcod4PDv7raQqPnNqH2LZil2wksAGfvDoRc2ZyyEw2+VzDocEyKAnyJiPmBTxLLYBwiWBjJ1sRAQmzYWbuO/+e8kuNA3GH8/cIt6LNwoPkWn+F1tvQLpSqQ5nRGQOdU2HEtADCLNuYuAzKm24VgCYhBpzl0EZE61Dcf6DFeJXwJtyKpUAAAAAElFTkSuQmCC"
						class="mask"
					/>
				</div>
				<div>
					<p class="username">{{ item.metaidInfo.name }}</p>
					<p class="buzztime">
						{{ $common.formatTimestamp(item.timestamp * 1000, '-') }}
					</p>
				</div>
			</div>
			<div class="Interactive">
				<div class="operationItem" style="cursor: pointer">
					<el-tooltip
						class="item"
						style="padding-left: 10px"
						effect="light"
						:content="$t('buzz_001')"
						placement="top"
					>
						<i
							@click="commontBuzz(item)"
							:class="
								item.commentCount == 0
									? 'el-icon-chat-round'
									: 'el-icon-chat-dot-round'
							"
							style="color: #409eff"
							>{{ item.commentCount > 0 ? item.commentCount : '' }}</i
						>
					</el-tooltip>
					<el-tooltip
						class="item"
						effect="light"
						:content="$t('buzz_002')"
						placement="top"
					>
						<i
							@click="likeBuzz(item)"
							class="el-icon-star-off"
							:class="{ 'el-icon-star-on': item.likeCount > 0 }"
							style="color: #409eff"
							>{{ item.likeCount }}
						</i>
					</el-tooltip>

					<el-tooltip
						class="item"
						effect="light"
						:content="$t('buzz_003')"
						placement="top"
					>
						<i
							@click="forwardBuzz(item)"
							class="el-icon-position"
							style="color: #409eff"
						></i>
					</el-tooltip>
					<el-tooltip
						class="item"
						effect="light"
						:content="$t('components_file_box_contextmenu_box_88')"
						placement="top"
					>
						<i
							class="el-icon-connection"
							@click="viewTx(item)"
							style="color: #409eff"
						></i>
					</el-tooltip>
				</div>
			</div>
		</div>

		<NewBuzzDialog
			:visible.sync="showNewBuzzDialog"
			@newBuzzSuccess="newBuzzSuccess"
			:isPayComment.sync="isPayComment"
			:isPayForward.sync="isPayForward"
			:quotePin="item"
		/>
	</div>
</template>

<script>
import NewBuzzDialog from './dialogs/newBuzzDialog'

export default {
	name: 'BuzzItem',
	props: {
		// 文件类型
		item: {
			required: true,
			type: Object
		},
		isQuote: {
			required: false,
			default: false,
			type: Boolean
		},
		isComment: {
			required: false,
			default: false,
			type: Boolean
		}
	},
	components: { NewBuzzDialog },
	data() {
		return {
			sureBtnLoading: false,
			showNewBuzzDialog: false,
			isPayComment: false,
			isPayForward: false,
			defaultUserUrl: require('_a/images/common/default_user.png'),
			network: 'mainet'
		}
	},
	async created() {
		this.network = (await window.metaidwallet.getNetwork()).network
	},
	async mounted() {},
	computed: {
		manHost() {
			if ('testnet' == this.network) {
				return 'https://man-test.metaid.io'
			}
			return 'https://man.metaid.io'
		},
		attachmentsUrls() {
			let urls = []
			if (this.item.attachmentsPids) {
				this.item.attachmentsPids.forEach((i) => {
					const url = this.manHost + `/content/${i}`
					urls.push(url)
				})
			}
			return urls
		}
	},
	methods: {
		newBuzzSuccess() {
			this.$emit('resetQuery')
		},
		// 点赞
		async likeBuzz(item) {
			const res = await window.$walletUtils.payLike(item.id)
			if (res) {
				this.$emit('resetQuery')
				this.$message.success(this.$t('csp_026'))
			}
		},
		// 评论
		commontBuzz(item) {
			console.log('commontBuzz', item)
			this.isPayForward = false
			this.isPayComment = true
			this.showNewBuzzDialog = true
		},
		forwardBuzz(item) {
			console.log('commontBuzz', item)
			this.isPayForward = true
			this.isPayComment = false
			this.showNewBuzzDialog = true
		},
		// 查看交易
		viewTx(item) {
			const url = `https://www.mvcscan.space/tx/${item.txid}`
			window.open(url, '_blank')
		},
		toDetail(item) {
			this.$router.push({ path: '/buzz/' + item.id })
		},
		goUserHome(item) {
			this.$router.push({ path: '/buzz/user/' + item.address })
		}
	}
}
</script>
<style lang="stylus" scoped>

.buzzContent{
  .showBack{
    margin-bottom: .1rem;
  }
  .buzzHtml {

    cursor: pointer;
    margin-left: 10px;
    padding: 1.5rem;

    text-overflow: ellipsis;
    font-size:18px;
    color: #809399;
  }

  .buzzImgList {
    margin-left: 10px;
    padding-left: 1.5rem;
    display: flex;
    flex-wrap: wrap;
   .buzzImgItem {
      width: 200px;
      height: 200px;
      margin-right: 10px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
  .item_operation {
    display: flex;
    align-items: center;
    justify-content:  space-between;
    border-top: 1px solid rgba(237,239,242,.27058823529411763);
    margin-top: 0.9rem;
    .item_operation_user{
      display: flex;
      cursor: pointer;
      .avatarWrap {
        position: relative;
        .avatar{
          width: 100%;
          height: 100%;
          display: block;
        }
        .mask{
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      .username{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .buzztime{
        font-size: 12px;
      }
    }
    .Interactive{
      display: flex;

      padding-left: .2rem;
      .operationItem {
        display: flex;
        margin-left: .6rem;


        .el-icon-download-price {
          font-size: 12px;
        }

        .item {
          padding-left: .8rem;
          height: 100%;
          width: 35px;
        }
        .item_operation_text {
          font-size: 13px;

        }
      }
    }
  }
}
</style>
