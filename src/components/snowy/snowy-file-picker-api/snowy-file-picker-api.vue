<template>
	<view>
		<snowy-file-picker
			v-model="localData"
			:map="map"
			:idDataType="idDataType"
			@getFileInfoById="getFileInfoById"
			@uploadFile="uploadFile"
			@deleteFile="deleteFile"
			:mediaType="props.mediaType"
			:sourceType="props.sourceType"
			:forbidAdd="props.disabled"
			:forbidDel="props.disabled"
			:limit="props.limit"
		>
		</snowy-file-picker>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref, onBeforeUnmount, computed, watch } from "vue"
	import fileApi from '@/api/dev/file-api'
	import { prefixUrl } from "@/utils/api-adaptive"
	import { ID_DATA_TYPE, CALLBACK_STATE } from "@/components/snowy/snowy-file-picker/enum"
	import store from '@/store'
	const emits = defineEmits(['update:modelValue'])
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
		disabled: {
			type: Boolean,
			default: false,
			required: false
		},
		// 媒体类型
		mediaType: {
			type: String,
			default: 'image', // image/video/all
			required: false
		},
		//album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
		sourceType: {
			type: Array,
			default () {
				return ['album', 'camera']
			}
		},
		uploadType: {
			type: String,
			default: 'Dynamic' // Dynamic || Local || Aliyun || Tencent
		},
		//限制数
		limit: {
			type: Number,
			default: 9
		},
	})
	const localData = ref('')
	const setLocalData = () => {
		localData.value = props.modelValue
	}
	setLocalData()
	watch(() => props.modelValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			setLocalData()
		}
	}, {
		deep: false,
		immediate: false
	})
	watch(() => localData.value, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			emits('update:modelValue', localData.value)
		}
	}, {
		deep: true,
		immediate: false
	})
	
	/**
	 * 获取文件信息
	 */
	const getFileInfoById = (param, callback) => {
		fileApi.fileDetail({ id: param[props.map.id] }).then(data => {
			// #ifndef APP-PLUS
			callback({
				state: CALLBACK_STATE.SUCCESS,
				data: {
					[props.map.id]: data.id,
					[props.map.name]: data.name,
					[props.map.url]: fileApi.previewFile(data.id),
					[props.map.ext]: data?.suffix,
				},
			})
			// #endif
			// #ifdef APP-PLUS
			fileApi.fileDownload(data.id).then(response => {
				callback({
					state: CALLBACK_STATE.SUCCESS,
					data: {
						[props.map.id]: data.id,
						[props.map.name]: data.name,
						[props.map.url]: response.tempFilePath,
						[props.map.ext]: data?.suffix,
					},
				})
			})
			// #endif
		})
	}
	
	/**
	 * 文件上传api
	 */
	const uploadApi = (param) => {
		return new Promise((resolve, reject) => {
			if ('Local' == props.uploadType) {
				fileApi.fileUploadReturnId(param).then(data => {
					resolve(data)
				}).catch((e) => {
					reject(e)
				})
			} else if ('Aliyun' == props.uploadType) {
				fileApi.fileUploadAliyunReturnId(param).then(data => {
					resolve(data)
				}).catch((e) => {
					reject(e)
				})
			} else if ('Tencent' == props.uploadType) {
				fileApi.fileUploadTencentReturnId(param).then(data => {
					resolve(data)
				}).catch((e) => {
					reject(e)
				})
			} else {
				fileApi.fileUploadDynamicReturnId(param).then(data => {
					resolve(data)
				}).catch((e) => {
					reject(e)
				})
			}
		})
	}
	/**
	 * 上传文件
	 */
	const uploadFile = (param, callback) => {
		uploadApi({ filePath: param.filePath }).then(data => {
			fileApi.fileDetail({ id: data }).then(detailData => {
				callback({
					state: CALLBACK_STATE.SUCCESS,
					data: {
						[props.map.id]: detailData.id,
						[props.map.name]: detailData.name,
						[props.map.url]: fileApi.previewFile(detailData.id),
						[props.map.ext]: detailData.suffix
					},
				})
			})
		})
	}
	/**
	 *  删除文件
	 */
	const deleteFile = (param, callback) => {
		fileApi.fileDelete([ { id: param.file[props.map.id] } ]).then(data => {
			callback({
				state: CALLBACK_STATE.SUCCESS,
				data: null,
			})
		})
	}
</script>
<style lang="scss" scoped>
	::v-deep .uni-row {
		display: flex;
		align-items: center;
		height: 100%;
	}
</style>