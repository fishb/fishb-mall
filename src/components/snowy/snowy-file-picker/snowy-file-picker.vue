<template>
	<snowy-file-view v-model="localFileList" :map="props.map">
		<template #fileItemExt="data">
			<view v-if="!forbidDel" class="file-del" @tap.stop="delFile(data.index)"></view>
		</template>
		<template #fileListExt>
			<view v-if="isShowAdd" class="upload-add snowy-shadow" @tap="chooseFile">
				<slot>
					<view class="upload-icon icon-plus"></view>
				</slot>
			</view>
		</template>
	</snowy-file-view>
</template>
<script setup>
	import { nextTick, reactive, ref, onBeforeUnmount, computed, watch } from "vue"
	import { isEmpty, handleIdData, getFileDataById } from './utils'
	import { ID_DATA_TYPE, CALLBACK_STATE } from './enum'
	const emits = defineEmits(['update:modelValue', 'getFileInfoById', 'uploadFile', 'deleteFile'])
	const props = defineProps({
		modelValue: {
			type: [String, Array]
		},
		map: {
			type: Object,
			default: () => {
				return {
					id: "id",
					name: "name",
					url: "url",
					ext: "ext"
				}
			},
			required: false
		},
		idDataType: {
			type: String,
			default: ID_DATA_TYPE.idStr.code,
			required: false
		},
		//禁用删除
		forbidDel: {
			type: Boolean,
			default: false
		},
		//禁用添加
		forbidAdd: {
			type: Boolean,
			default: false
		},
		// 媒体类型
		mediaType: {
			type: String,
			default: 'image', // image/video/all
			required: false
		},
		//限制数
		limit: {
			type: Number,
			default: 9
		},
		//original 原图，compressed 压缩图，默认二者都有
		sizeType: {
			type: Array,
			default () {
				return ['original', 'compressed']
			}
		},
		//album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
		sourceType: {
			type: Array,
			default () {
				return ['album', 'camera']
			}
		},
		//可上传图片类型，默认为空，不限制  Array<String> ['jpg','png','gif']
		imageFormat: {
			type: Array,
			default () {
				return []
			}
		},
		//单张图片大小限制 MB
		size: {
			type: Number,
			default: 50
		},
	})
	const localFileList = ref([])
	const setLocalFileList = () => {
		const idArr = handleIdData(props.modelValue, props.idDataType)
		const promiseList = []
		for (let i = 0; i < idArr.length; i++) {
			promiseList.push(new Promise((resolve, reject) => {
				emits('getFileInfoById', { [props.map.id]: idArr[i] }, ({ state, data, msg }) => {
					// 回调错误异常处理
					if (state === CALLBACK_STATE.ERROR) {
						uni.showModal({
							title: '警告提示',
							content: msg,
							showCancel: false
						})
						return
					}
					resolve(data)
				})
			}))
		}
		Promise.all(promiseList).then((result) => {
			localFileList.value = result
		}).catch(err => {
			console.log(err)
		})
	}
	setLocalFileList()
	watch(() => props.modelValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			setLocalFileList()
		}
	}, {
		deep: false,
		immediate: false
	})
	/**
	 * 删除文件
	 */
	const delFile = (index) => {
		uni.showModal({
			title: '提示',
			content: '确认删除该文件吗？',
			showCancel: true,
			cancelColor: "#555",
			confirmColor: "#eb0909",
			confirmText: "确定",
			success(res) {
				if (res.confirm) {
					emits('deleteFile', { file: localFileList.value[index] }, ({ state, data, msg }) => {
						// 回调错误异常处理
						if (state === CALLBACK_STATE.ERROR) {
							uni.showModal({
								title: '警告提示',
								content: msg,
								showCancel: false
							})
							return
						}						
						localFileList.value.splice(index, 1)
						emits('update:modelValue', getFileDataById(props.idDataType, localFileList.value, props.map))
					})
				}
			}
		})
	}
	// 是否显示新增按钮
	const isShowAdd = computed(() => {
		let isShow = true;
		if (props.forbidAdd || (props.limit && localFileList.value.length >= props.limit)) {
			isShow = false;
		}
		return isShow
	})
	// 选择文件
	const chooseFile = () => {
		if ('image' == props.mediaType) {
			uni.chooseImage({
				count: props.limit - localFileList.value.length,
				sizeType: props.sizeType,
				sourceType: props.sourceType,
				success: function(e) {
					const promiseList = []
					for (let i = 0; i < e.tempFiles.length; i++) {
						let len = localFileList.value.length;
						if (len >= props.limit) {
							uni.showToast({
								title: `最多可上传${props.limit}个文件`,
								icon: "none"
							})
							break;
						}
						//过滤图片类型
						let path = e.tempFiles[i].path;
						if (props.imageFormat.length > 0) {
							let format = ""
							// #ifdef H5
							let type = e.tempFiles[i].type;
							format = type.split('/')[1]
							// #endif
							// #ifndef H5
							format = path.split(".")[(path.split(".")).length - 1];
							// #endif
							if (props.imageFormat.indexOf(format) == -1) {
								let text = `只能上传 ${props.imageFormat.join(',')} 格式图片！`
								uni.showToast({
									title: text,
									icon: "none"
								})
								continue;
							}
							//过滤超出大小限制文件
							let size = e.tempFiles[i].size;
							if (props.size * 1024 * 1024 < size) {
								let err = `单个文件大小不能超过：${props.size}MB`
								uni.showToast({
									title: err,
									icon: "none"
								})
								continue;
							}
						}
						promiseList.push(
							new Promise((resolve, reject) => {
								emits('uploadFile', { filePath: path }, ({ state, data, msg }) => {
									// 回调错误异常处理
									if (state === CALLBACK_STATE.ERROR) {
										uni.showModal({
											title: '警告提示',
											content: msg,
											showCancel: false
										})
										return
									}
									resolve(data)
								})
							})
						)
					}
					
					if (isEmpty(promiseList)) {
						return
					}
					Promise.all(promiseList).then((result) => {
						localFileList.value.push(...result)
						emits('update:modelValue', getFileDataById(props.idDataType, localFileList.value, props.map))
					}).catch(err => {
						console.log(err)
					})
				}
			})
		}
		if ('video' == props.mediaType) {
			uni.chooseVideo({
				sourceType: props.sourceType,
				success: function(e) {
					let len = localFileList.value.length;
					if (len >= props.limit) {
						uni.showToast({
							title: `最多可上传${props.limit}个文件`,
							icon: "none"
						})
						return;
					}
					// #ifdef H5
					//过滤超出大小限制文件
					let size = e.tempFile.size;
					if (props.size * 1024 * 1024 < size) {
						let err = `单个文件大小不能超过：${props.size}MB`
						uni.showToast({
							title: err,
							icon: "none"
						})
						return;
					}
					// #endif
					emits('uploadFile', { filePath: e.tempFilePath }, ({ state, data, msg }) => {
						// 回调错误异常处理
						if (state === CALLBACK_STATE.ERROR) {
							uni.showModal({
								title: '警告提示',
								content: msg,
								showCancel: false
							})
							return
						}
						localFileList.value.push(data)
						emits('update:modelValue', getFileDataById(props.idDataType, localFileList.value, props.map))
					})
					
				}
			})
		}
		
	}
</script>
<style lang="scss" scoped>
	@font-face {
		font-family: 'snowyUpload';
		src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAATcAA0AAAAAByQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEwAAAABoAAAAciR52BUdERUYAAASgAAAAHgAAAB4AKQALT1MvMgAAAaAAAABCAAAAVjxvR/tjbWFwAAAB+AAAAEUAAAFK5ibpuGdhc3AAAASYAAAACAAAAAj//wADZ2x5ZgAAAkwAAADXAAABAAmNjcZoZWFkAAABMAAAAC8AAAA2FpiS+WhoZWEAAAFgAAAAHQAAACQH3QOFaG10eAAAAeQAAAARAAAAEgwAACBsb2NhAAACQAAAAAwAAAAMAEoAgG1heHAAAAGAAAAAHwAAACABEgA2bmFtZQAAAyQAAAFJAAACiCnmEVVwb3N0AAAEcAAAACgAAAA6OMUs4HjaY2BkYGAAYo3boY/i+W2+MnCzMIDAzb3qdQj6fwPzf+YGIJeDgQkkCgA/KAtvAHjaY2BkYGBu+N/AEMPCAALM/xkYGVABCwBZ4wNrAAAAeNpjYGRgYGBl0GJgZgABJiDmAkIGhv9gPgMADTABSQB42mNgZGFgnMDAysDA1Ml0hoGBoR9CM75mMGLkAIoysDIzYAUBaa4pDA7PGJ9xMjf8b2CIYW5gaAAKM4LkANt9C+UAAHjaY2GAABYIVmBgAAAA+gAtAAAAeNpjYGBgZoBgGQZGBhBwAfIYwXwWBg0gzQakGRmYnjE+4/z/n4EBQksxSf6GqgcCRjYGOIeRCUgwMaACRoZhDwCiLwmoAAAAAAAAAAAAAAAASgCAeNpdjkFKw0AARf/vkIR0BkPayWRKQZtYY90ohJju2kOIbtz0KD1HVm50UfEmWXoAr9ADOHFARHHzeY//Fx8Ci+FJfIgdJFa4AhgiMshbrCuIsLxhFJZVs+Vl1bT1GddtbXTC3OhohN4dg4BJ3zMJAnccyfm468ZzHXddrH9ZKbHzdf9n/vkY/xv9sPQXgGEvBrHHwst5kTbXLE+YpYVPkxepPmW94W16UbdNJd6f3SAzo5W7m1jaKd+8ZZIvk5nlKw9SK6Wle7BLS3f/bTzQLmfAF2T1NsQAeNp9kD1OAzEQhZ/zByQSQiCoXVEA2vyUKRMp9Ailo0g23pBo1155nUg5AS0VB6DlGByAGyDRcgpelkmTImvt6PObmeexAZzjGwr/3yXuhBWO8ShcwREy4Sr1F+Ea+V24jhY+hRvUf4SbuFUD4RYu1BsdVO2Eu5vSbcsKZxgIV3CKJ+Eq9ZVwjfwqXMcVPoQb1L+EmxjjV7iFa2WpDOFhMEFgnEFjig3jAjEcLJIyBtahOfRmEsxMTzd6ETubOBso71dilwMeaDnngCntPbdmvkon/mDLgdSYbh4FS7YpjS4idCgbXyyc1d2oc7D9nu22tNi/a4E1x+xRDWzU/D3bM9JIbAyvkJI18jK3pBJTj2hrrPG7ZynW814IiU68y/SIx5o0dTr3bmniwOLn8owcfbS5kj33qBw+Y1kIeb/dTsQgil2GP5PYcRkAAAB42mNgYoAALjDJyIAOWMGiTIxMjMxsKak5qSWpbFmZiRmJ+QAmgAUIAAAAAf//AAIAAQAAAAwAAAAWAAAAAgABAAMABAABAAQAAAACAAAAAHjaY2BgYGQAgqtL1DlA9M296nUwGgA+8QYgAAA=) format('woff');
		font-weight: normal;
		font-style: normal;
	}

	.upload-icon {
		font-family: "snowyUpload" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		padding: 10rpx;
		color: #888;
		font-size: 50rpx;
	}

	.icon-plus:before {
		content: "\e609";
	}

	.file-del {
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		right: 0rpx;
		top: -5rpx;
		border-radius: 50%;
		color: #ffffff;
		font-size: 34rpx;
		z-index: 5;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		background: #EB0909;
	}

	.file-del::before {
		content: '';
		width: 15rpx;
		height: 1rpx;
		position: absolute;
		left: 10rpx;
		top: 18rpx;
		background-color: #fff;
	}

	.upload-add {
		font-weight: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		overflow: hidden;
		box-sizing: border-box;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		width: 150rpx;
		height: 150rpx;
		margin: 10rpx;
	}
</style>