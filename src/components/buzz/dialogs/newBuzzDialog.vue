<template>
	<!-- 分享对话框 -->
	<el-drawer
		:title="title"
		:visible.sync="visibleInChild"
		:close-on-click-modal="false"
		size="100%"
		@close="handleDialogCancel"
	>
		<el-form
			:model="form"
			ref="newBuzzForm"
			label-suffix="："
			label-width="100px"
			:label-position="screenWidth <= 520 ? 'top' : 'right'"
			:rules="rules"
		>
			<el-form-item prop="content">
				<el-input
					style="padding-right: 20px"
					type="textarea"
					:rows="9"
					placeholder="please input content"
					v-model="form.content"
				>
				</el-input>
			</el-form-item>
			<el-form-item>
				<!-- 上传文件组件 -->
				<uploader
					class="uploader-app"
					ref="uploader"
					:options="options"
					:autoStart="false"
					:fileStatusText="fileStatusText"
					@files-added="handleFilesAdded"
					@file-success="handleFileSuccess"
					@file-error="handleFileError"
				>
					<uploader-unsupport></uploader-unsupport>
					<!-- 选择按钮 在这里隐藏 -->
					<uploader-btn class="select-file-btn" :attrs="attrs" ref="uploadBtn"
						>select image</uploader-btn
					><el-button
						style="margin-left: 20px"
						size="small"
						type="success"
						:loading="sureBtnLoading"
						@click="handleDialogSure('newBuzzForm')"
						>submit</el-button
					>
					<el-button @click="handleDialogCancel" size="small">{{
						$t('components_header_321')
					}}</el-button>
					<uploader-list>
						<template v-slot:default="props">
							<div class="file-panel">
								<div class="file-title">
									<span class="title-span">
										Images<span class="count"
											>（{{ props.fileList.length }}）</span
										>
									</span>
								</div>
								<!-- 正在上传的文件列表 -->
								<el-collapse-transition>
									<ul class="file-list" v-show="!collapse">
										<li
											class="file-item"
											style="
												display: flex;
												justify-content: space-between;
												align-items: center;
												margin-right: 20px;
											"
											:class="{ 'custom-status-item': file.statusStr !== '' }"
											v-for="file in props.fileList"
											:key="file.id"
										>
											<el-image
												style="width: 100px; height: 100px"
												:src="imgUrl(file)"
												:preview-src-list="imgUrls()"
											></el-image>

											<span>{{ file.name }}</span
											><span style="padding-left: 20px">{{
												$file.calculateFileSize(file.size)
											}}</span>
											<span style="padding-left: 20px"
												><el-button @click="handleRemove(file)" size="mini"
													>remove</el-button
												></span
											>
										</li>
										<div class="no-file" v-if="!props.fileList.length">
											<i class="icon-empty-file"></i>
											{{ $t('components_file_box_uploadfile_box_170') }}
										</div>
									</ul>
								</el-collapse-transition>
							</div>
						</template>
					</uploader-list>
				</uploader>
			</el-form-item>
		</el-form>
		<el-form
			v-if="shareIsSuccess"
			class="share-success-form"
			ref="shareSuccessForm"
			label-suffix="："
			label-width="90px"
			:label-position="screenWidth <= 520 ? 'top' : 'right'"
		>
		</el-form>
	</el-drawer>
</template>

<script>
import store from '@/store/index.js'
import metaidv2Utils from '@/utils/metaidv2Utils.js'

export default {
	name: 'newBuzzDialog',

	props: {
		visible: {
			required: false,
			default: false,
			type: Boolean
		},
		quotePin: {
			required: false,
			type: Object
		},
		isPayComment: {
			required: false,
			default: false,
			type: Boolean
		},
		isPayForward: {
			required: false,
			default: false,
			type: Boolean
		}
	},
	data() {
		return {
			// 上传组件配置项
			options: {
				forceChunkSize: true,
				chunkSize: 1024 * 1024 * 5, //  每个分片的大小,5M
				fileParameterName: 'file', //  上传文件时文件的参数名，默认 file
				maxChunkRetries: 2, //  并发上传数，默认 3
				testChunks: false //  是否开启分片已存在于服务器的校验
			},
			// 文件状态文案映射
			fileStatusText: {
				success: this.$t('components_file_box_uploadfile_adduploadtask_141'),
				error: 'error',
				uploading: this.$t('components_file_box_uploadfile_adduploadtask_142'),
				paused: this.$t('components_file_box_uploadfile_adduploadtask_143'),
				waiting: this.$t('components_file_box_uploadfile_adduploadtask_144')
			},
			attrs: {
				accept: 'image/*'
			},
			panelShow: true, //  上传文件面板是否显示
			collapse: false, //	上传文件面板是否折叠
			dropBoxShow: false, //  拖拽上传是否显示
			// 粘贴图片的信息
			pasteImg: {
				src: '',
				name: ''
			},
			// 对话框数据
			form: {
				content: ''
			},
			rules: {
				content: [
					{
						required: true,
						message: 'buzz content can not empty',
						trigger: 'blur'
					}
				]
			},
			sureBtnLoading: false,
			shareIsSuccess: true //  分享是否成功
		}
	},
	created() {},
	computed: {
		title() {
			if (this.isPayComment) {
				if (!this.quotePin) {
					this.$message.error('param error')
				}
				return 'Comment Buzz'
			}
			if (this.isPayForward) {
				if (!this.quotePin) {
					this.$message.error('param error')
				}
				return 'Forward Buzz'
			}
			return 'New Buzz'
		},
		// 屏幕宽度
		screenWidth() {
			return store.state.common.screenWidth
		},
		finallyContent() {
			//return `#MetaDiskBuzz<br/>${this.form.content}`
			return `${this.form.content}`
		},
		visibleInChild: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit('update:visible', val)
			}
		}
	},
	methods: {
		handleRemove(file) {
			file.cancel()
		},
		/**
		 * 关闭上传面板，并停止上传
		 */
		handleClosePanel() {
			//this.uploaderInstance.cancel()
			this.panelShow = false
			//this.callback('cancel')
		},
		/**
		 * 添加批量文件的回调函数
		 * @description 对单个或批量文件都按此逻辑处理
		 * @param {object} files 批量文件信息
		 */
		async handleFilesAdded(files) {
			console.log('files:', files, this.$refs.uploader.fileList.length)
		},
		imgUrl(file) {
			return window.URL.createObjectURL(file.file)
		},
		imgUrls() {
			const list = []
			for (let i = 0; i < this.$refs.uploader.fileList.length; i++) {
				const file = this.$refs.uploader.fileList[i]
				list.push(this.imgUrl(file))
			}
			return list
		},
		/**
		 * 文件上传成功 回调函数
		 * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
		 * @param {object} file 当前成功的 Uploader.File 对象本身
		 * @param {string} response 服务端响应内容，永远都是字符串
		 */
		handleFileSuccess(rootFile, file, response) {
			console.log(rootFile, file, response)
		},
		/**
		 * 文件上传失败 回调函数
		 * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
		 * @param {object} file 当前成功的 Uploader.File 对象本身
		 * @param {string} response 服务端响应内容，永远都是字符串
		 */
		handleFileError(rootFile, file, response) {
			console.log(rootFile, file, response)
		},

		handleDialogCancel() {
			this.visibleInChild = false
		},

		async imageTxs() {
			let fileTransactions = []
			const finalAttachMetafileUri = []
			for (let i = 0; i < this.$refs.uploader.fileList.length; i++) {
				const current = this.$refs.uploader.fileList[i]

				// 压缩图片
				const compressed = await metaidv2Utils.compressImage(current.file)
				const fileResult = await metaidv2Utils.fileToAttachment(
					current.type === 'image/gif' ? current.file : compressed
				)
				let opReturnFieldList = [
					Buffer.from('metaid'),
					Buffer.from('create'),
					Buffer.from('/file'),
					Buffer.from('0'),
					Buffer.from('1.0.0'),
					Buffer.from(`${fileResult.fileType};binary`),
					Buffer.from(Buffer.from(fileResult.data, 'hex'))
				]
				//console.log('imageTxs', opReturnFieldList.toString())
				const { transactions } = await window.$walletUtils.createPin(
					opReturnFieldList,
					{
						serialAction: 'combo',
						transactions: fileTransactions
					}
				)
				if (!transactions) {
					throw new Error('upload image file failed')
				}
				finalAttachMetafileUri.push(
					'metafile://' +
						transactions[transactions.length - 1].txComposer.getTxId() +
						'i0'
				)
				fileTransactions = transactions
			}
			return {
				transactions: fileTransactions,
				attachments: finalAttachMetafileUri
			}
		},
		async handleDialogSure(formName) {
			this.sureBtnLoading = true
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					let options = {
						content: this.finallyContent
					}
					//图片添加add images
					const imageRes = await this.imageTxs()

					options.transactions = imageRes.transactions
					options.attachments = imageRes.attachments

					if (this.isPayForward) {
						options.quotePin = this.quotePin.id
					}
					let res = null
					if (this.isPayComment) {
						options.commentTo = this.quotePin.id

						res = await window.$walletUtils.payComment(options).catch((res) => {
							this.sureBtnLoading = false
							this.$message.error('Error comment Buzz:' + res)
						})
					} else {
						res = await window.$walletUtils
							.shareToBuzz(options)
							.catch((res) => {
								this.sureBtnLoading = false
								this.$message.error('Error Buzz:' + res)
							})
					}

					this.sureBtnLoading = false

					if (res) {
						this.$message.success(this.$t('csp_026'))
						this.$refs[formName].resetFields()
						for (let i = this.$refs.uploader.fileList.length - 1; i >= 0; i--) {
							this.$refs.uploader.uploader.removeFile(
								this.$refs.uploader.fileList[i]
							)
						}

						setTimeout(() => {
							this.$emit('newBuzzSuccess')
						}, 500)
						this.visibleInChild = false
					}
				} else {
					this.sureBtnLoading = false
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.success-tip {
  margin-bottom: 16px;
  text-align: center;
  color: $Success;

  .el-icon-success {
    margin-right: 8px;
    height: 20px;
    line-height: 20px;
  }


}
</style>
