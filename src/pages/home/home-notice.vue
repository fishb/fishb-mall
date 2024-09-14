<template>
	<view style="background: #FFF9EA;">
		<uni-row>
			<uni-col :span="2">
				<view class="snowy-flex-vh-center">
					<uni-icons type="sound-filled" size="22" color="#FF9A43"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="20">
				<swiper :vertical="true" :autoplay="true" :circular="true" :interval="4000" style="flex: 1; height: 80rpx">
					<swiper-item class="snowy-flex-v-center" v-for="(item,index) in notice" :key="index">
						<view class="snowy-text-ellipsis" style="color: #FF9A43;">{{ item.title || ''}}</view>
					</swiper-item>
				</swiper>
			</uni-col>
			<uni-col :span="2">
				<view class="snowy-flex-vh-center" @tap.stop="getMore">
					<uni-icons type="right" size="20" color="#FF9A43"></uni-icons>
				</view>
			</uni-col>
		</uni-row>
	</view>
</template>
<script setup>
	import { ref } from 'vue'
	import bizIndexApi from '@/api/biz/biz-index-api'
	const notice = ref([])
	const loadData = async () => {
		notice.value = await bizIndexApi.bizIndexNoticeList() || []
	}
	loadData()
	const getMore = () => {
		uni.$snowy.tab.navigateTo("/pages/biz/notice/index")
	}
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';
	
	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
	}
</style>