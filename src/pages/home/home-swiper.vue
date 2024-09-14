<template>
	<uni-swiper-dot :info="swiperInfo" :current="current" field="content">
		<swiper :current="swiperDotIndex" :autoplay="true" :interval="3000" :duration="1000" @change="changeSwiper">
			<swiper-item v-for="(item, index) in swiperInfo" :key="index">
				<view @click="clickBannerItem(item)">
					<image style="width:100%; border-radius: 5upx;" :src="item.image" mode="widthFix" :draggable="false" />
				</view>
			</swiper-item>
		</swiper>
	</uni-swiper-dot>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import store from '@/store'
	import { prefixUrl } from "@/utils/api-adaptive"
	import bizIndexApi from '@/api/biz/biz-index-api'
	const current = ref(0)
	const swiperDotIndex = ref(0)
	const swiperInfo = ref([{
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper1.jpg`
	}, {
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper2.jpg`
	}])
	const loadData = async () => {
		const param = {
			place: 'BACK_MOBILE'
		}
		swiperInfo.value = await bizIndexApi.bizIndexSlideshowList(param)
	}
	loadData()
	const changeSwiper = (e) => {
		current.value = e.detail.current
	}
	const clickBannerItem = (item) => {
		if (uni.$snowy.tool.isEmpty(item.pathDetails)) {
			return
		}
		let detailObj = {}
		if (typeof detail !== 'object') {
			detailObj = JSON.parse(item.pathDetails)
		}
		// json内包含且是开启了点击，否则不处理
		if (detailObj.whetherToClick && detailObj.whetherToClick === 'ENABLE') {
			if (detailObj.skipMode && detailObj.skipMode === 'URL') {
				// #ifdef H5
				self.location.href = detailObj.url
				// #endif
				// #ifndef H5
				uni.$snowy.tab.navigateTo(`/pages/common/webview/index?url=${detailObj.url}`)
				// #endif
			}
			if (detailObj.skipMode && detailObj.skipMode === 'ROUTER') {
				uni.$snowy.tab.navigateTo(detailObj.url)
			}
		}
	}
</script>
<style>
</style>