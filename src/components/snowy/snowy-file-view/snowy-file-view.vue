<template>
	<view>
		<view class="view-box">
			<view class="file-item" v-for="(item,index) in localFileList" :key="index">
				<image :src="getFileSrc(item)" mode="aspectFill" @tap.stop="openFile(item)" class="img-item snowy-shadow" :style="imgCustomStyle">
				</image>
				<slot name="fileItemExt" :item="item" :index="index"></slot>
			</view>
			<slot name="fileListExt"></slot>
		</view>
		<snowy-video-view ref="previewVideo"></snowy-video-view>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref, onBeforeUnmount, computed, watch } from "vue"
	import { getFileUrl } from './utils'
	import { FILE_TYPE } from './enum'
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
		imgCustomStyle: {
			type: Object,
			default: () => {
				return {
					width: '150rpx',
					height: '150rpx',
					borderRadius: '5rpx'
				}
			},
			required: false
		}
	})
	const previewVideo = ref()
	const localFileList = ref([])
	const setLocalFileList = () => {
		localFileList.value = props.modelValue
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
	const getFileSrc = (item) => {
		const fileType = item && item[props.map.ext] ? item[props.map.ext] : ''
		return getFileUrl(fileType, item[props.map.url])
	}
	/**
	 * 打开文件
	 */
	const openFile = (item) => {
		if (FILE_TYPE.image.exts.includes(item?.ext)) {
			uni.previewImage({
				current: item[props.map.url],
				loop: true,
				urls: localFileList.value.filter(img => FILE_TYPE.image.exts.includes(img.ext)).map(img => img.url)
			})
			return
		}
		
		if (FILE_TYPE.video.exts.includes(item?.ext)) {
			previewVideo.value.open(item[props.map.url])
			return
		}
		
		// #ifdef H5
		self.location.href = item[props.map.url]
		// #endif
		// #ifndef H5
		// fileDownload(item[props.map.id]).then(response => {
		// 	uni.openDocument({
		// 		filePath: response.tempFilePath,
		// 		success: () => {}
		// 	});
		// })
		// #endif
	}
</script>
<style lang="scss" scoped>
	.view-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		background: #f4f4f5;
	}

	.file-item {
		position: relative;
		padding: 10rpx;
	}

	.img-item {
		display: block;
	}
</style>