<template>
	<view>
		<view class="snowy-page">
			<view class="snowy-shadow snowy-item snowy-padding">
				<uni-row>
					<uni-col :span="3">
						<view class="snowy-main-title snowy-text-bold snowy-text-ellipsis" :style="{color: noticeData.type==='NOTICE' ? '#18bc37' : noticeData.type==='ANNOUNCEMENT' ? '#5677fc' : '#f3a73f'  }">
							{{ $xeu.find(bizNoticeType, i => i.value === noticeData?.type)?.text }}
						</view>
					</uni-col>
					<uni-col :span="21">
						<view class="snowy-main-title snowy-text-bold">
							{{ noticeData?.title || '-' }}
						</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<image v-if="noticeData.image" style="width: 100%;" :src="noticeData.image" mode="widthFix"></image>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<rich-text :nodes="noticeData?.content"></rich-text>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<view class="snowy-sub-title">摘要：{{ noticeData?.digest || '-' }}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="10">
						<view class="snowy-sub-title">创建人：{{ noticeData?.createUserName || '-' }}</view>
					</uni-col>
					<uni-col :span="14">
						<view class="snowy-sub-title">创建时间：{{ noticeData?.createTime || '-' }}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="10">
						<view class="snowy-sub-title">修改人 ：{{ noticeData?.updateUserName || '-' }}</view>
					</uni-col>
					<uni-col :span="14">
						<view class="snowy-sub-title">创建时间：{{ noticeData?.updateTime || '-' }}</view>
					</uni-col>
				</uni-row>
			</view>
		</view>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import bizNoticeApi from '@/api/biz/biz-notice-api'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const bizNoticeType = uni.$snowy.tool.dictList('BIZ_NOTICE_TYPE')
	const noticeData = ref({})
	onLoad((option) => {
		if (!option.id) {
			return
		}
		bizNoticeApi.detail({
			id: option.id
		}).then((data) => {
			noticeData.value = data
		})
	})
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
		margin: 15rpx;
	}
</style>