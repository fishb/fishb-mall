<template>
	<view>
		<view class="snowy-page">
			<view class="snowy-shadow snowy-item snowy-padding">
				<uni-row>
					<uni-col :span="24">
						<view class="snowy-main-title snowy-text-bold">{{ record?.subject }}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<view class="snowy-sub-title">{{ record?.createTime }}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<view>{{ record?.content }}</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="snowy-shadow snowy-item snowy-padding" v-for="(item, index) in receiveInfoList" :key="index">
				<uni-row>
					<uni-col :span="12">
						<view>姓名</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end">{{ item.receiveUserName }}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="12">
						<view>是否已读</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end">
							<uni-tag v-if="!!item.read" text="已读" />
							<uni-tag v-if="!item.read" text="未读" type="primary" />
						</view>
					</uni-col>
				</uni-row>
			</view>
		</view>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref } from "vue"
	import userCenterApi from '@/api/sys/user-center-api'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const record = ref({})
	const receiveInfoList = ref([])
	onLoad((option) => {
		if (!option.id) {
			return
		}
		userCenterApi.userLoginUnreadMessageDetail({
			id: option.id
		}).then((data) => {
			record.value = data
			record.value.createTime = option?.createTime
			receiveInfoList.value = data.receiveInfoList
		})
	})
</script>
<style lang="scss" scoped>
	::v-deep .uni-row {
		margin: 15rpx;
	}
</style>