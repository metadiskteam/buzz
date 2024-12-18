<template>
	<div>
		<div class="user-info-head" @click="editCropper()">
			<img
				v-bind:src="options.img"
				:title="$t('buzz_005')"
				class="img-circle img-lg"
			/>
		</div>
		<el-dialog
			:title="title"
			:visible.sync="open"
			width="800px"
			append-to-body
			@opened="modalOpened"
			:before-close="handleClose"
		>
			<el-row>
				<el-col :xs="24" :md="12" :style="{ height: '350px' }">
					<vue-cropper
						ref="cropper"
						:img="options.img"
						:info="true"
						:autoCrop="options.autoCrop"
						:autoCropWidth="options.autoCropWidth"
						:autoCropHeight="options.autoCropHeight"
						:fixedBox="options.fixedBox"
						@realTime="realTime"
						v-if="visible"
					/>
				</el-col>
				<el-col :xs="24" :md="12" :style="{ height: '350px' }">
					<div class="avatar-upload-preview">
						<img :src="previews.url" :style="previews.img" />
					</div>
				</el-col>
			</el-row>
			<br />
			<el-row>
				<el-col :lg="2" :md="2">
					<el-upload
						action="#"
						:http-request="requestUpload"
						:show-file-list="false"
						:before-upload="beforeUpload"
					>
						<el-button size="small">
							{{ $t('buzz_006') }}
							<i class="el-icon-upload el-icon--right"></i>
						</el-button>
					</el-upload>
				</el-col>
				<el-col :lg="{ span: 1, offset: 2 }" :md="2">
					<el-button
						icon="el-icon-plus"
						size="small"
						@click="changeScale(1)"
					></el-button>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="el-icon-minus"
						size="small"
						@click="changeScale(-1)"
					></el-button>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="el-icon-refresh-left"
						size="small"
						@click="rotateLeft()"
					></el-button>
				</el-col>
				<el-col :lg="{ span: 1, offset: 1 }" :md="2">
					<el-button
						icon="el-icon-refresh-right"
						size="small"
						@click="rotateRight()"
					></el-button>
				</el-col>
				<el-col :lg="{ span: 2, offset: 6 }" :md="2">
					<el-button type="primary" size="small" @click="uploadImg()"
						>submit</el-button
					>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import metaidv2Utils from '@/utils/metaidv2Utils.js'
import { VueCropper } from 'vue-cropper'
import store from '@/store'

export default {
	components: { VueCropper },
	props: {
		user: {
			type: Object
		}
	},
	data() {
		return {
			// 是否显示弹出层
			open: false,
			// 是否显示cropper
			visible: false,
			// 弹出层标题
			title: this.$t('Modify avatar'),
			options: {
				img: store.getters.avatar, //裁剪图片的地址
				autoCrop: true, // 是否默认生成截图框
				autoCropWidth: 200, // 默认生成截图框宽度
				autoCropHeight: 200, // 默认生成截图框高度
				fixedBox: true // 固定截图框大小 不允许改变
			},
			previews: {}
		}
	},
	async created() {
		this.network = (await window.metaidwallet.getNetwork()).network
	},
	async mounted() {
		this.network = (await window.metaidwallet.getNetwork()).network
		let manHost = 'https://man.metaid.io'
		if ('testnet' == this.network) {
			manHost = 'https://man-test.metaid.io'
		}
		if (this.userConfig.avatar) {
			this.options.img = manHost + this.userConfig.avatar
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
		manHost() {
			if ('testnet' == this.network) {
				return 'https://man-test.metaid.io'
			}
			return 'https://man.metaid.io'
		}
	},
	methods: {
		async handleClose(done) {
			if (!this.userConfig.avatar) {
				this.options.img = null
			}

			done()
		},
		// 编辑头像
		editCropper() {
			this.open = true
		},
		// 打开弹出层结束时的回调
		modalOpened() {
			this.visible = true
		},
		// 覆盖默认的上传行为
		requestUpload() {},
		// 向左旋转
		rotateLeft() {
			this.$refs.cropper.rotateLeft()
		},
		// 向右旋转
		rotateRight() {
			this.$refs.cropper.rotateRight()
		},
		// 图片缩放
		changeScale(num) {
			num = num || 1
			this.$refs.cropper.changeScale(num)
		},
		// 上传预处理
		beforeUpload(file) {
			if (file.type.indexOf('image/') == -1) {
				this.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
			} else {
				const reader = new FileReader()
				reader.readAsDataURL(file)
				reader.onload = () => {
					this.options.img = reader.result
				}
			}
		},
		// 上传图片
		async uploadImg() {
			this.$refs.cropper.getCropBlob(async (data) => {
				// 压缩图片
				const compressed = await metaidv2Utils.compressImage(data)
				const fileResult = await metaidv2Utils.fileToAttachment(compressed)

				let opReturnFieldList = [
					Buffer.from('metaid'),
					Buffer.from('create'),
					Buffer.from('/info/avatar'),
					Buffer.from('0'),
					Buffer.from('1.0.0'),
					Buffer.from(`${fileResult.fileType};binary`),
					Buffer.from(Buffer.from(fileResult.data, 'hex'))
				]
				const res = await window.$walletUtils.createPin(opReturnFieldList)
				if (res) {
					this.options.img = URL.createObjectURL(data)
					this.$store.commit('SET_AVATAR', this.options.img)
					this.open = false
					this.visible = false
					this.userConfig.avatar = '/content/' + res + 'i0'
					await this.$store.dispatch('changeUserInfoObj', this.userConfig)
					this.$message({
						type: 'success',
						message: 'success'
					})
				}
			})
		},
		// 实时预览
		realTime(data) {
			this.previews = data
		}
	}
}
</script>
<style scoped>
.img-circle {
	border-radius: 50%;
}

.img-lg {
	width: 120px;
	height: 120px;
}
.avatar-upload-preview {
	position: absolute;
	top: 50%;
	transform: translate(50%, -50%);
	width: 180px;
	height: 180px;
	border-radius: 50%;
	box-shadow: 0 0 4px #ccc;
	overflow: hidden;
}
.user-info-head {
	position: relative;
	display: inline-block;
	height: 120px;
}

.user-info-head:hover:after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	color: #eee;
	background: rgba(0, 0, 0, 0.5);
	font-size: 24px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	cursor: pointer;
	line-height: 110px;
	border-radius: 50%;
}
</style>
