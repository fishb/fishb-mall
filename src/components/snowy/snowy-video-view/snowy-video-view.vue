<template>
	<tui-bottom-popup backgroundColor="transparent" :show="show" @close="close">
		<view class="snowy-shadow" v-if="show" style="margin-top: 10rpx;">
			<view class="snowy-flex-end">
				<icon type="clear" :size="20" color="#5677fc" @click="close"></icon>
			</view>
			<video class="video" :src="getSec" :autoplay="autoplay"></video>
		</view>
	</tui-bottom-popup>
</template>
<script setup>
	import { ref, reactive, computed } from "vue"
	const props = defineProps({
		src: {
			type: String,
			default: ''
		},
		autoplay: {
			type: Boolean,
			default: true
		}
	})
	const videoSrc = ref('')
	const show = ref(false)
	const getSec = computed(() => {
		return props.src || videoSrc.value
	})
	const open = (url) => {
		videoSrc.value = url
		show.value = true
	}
	const close = () => {
		show.value = false
	}
	defineExpose({
		open
	})
</script>
<style scoped lang="scss">
	.video {
		width: 100vw;
	}
</style>