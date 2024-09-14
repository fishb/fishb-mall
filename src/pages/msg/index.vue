<template>
	<view>
		<z-paging ref="dataPagingRef" :fixed="true" use-virtual-list :force-close-inner-list="true" cell-height-mode="dynamic" @virtualListChange="virtualListChange" @query="loadData" :auto="true">
			<template #top>
				<view class="snowy-z-paging-top">
					<tui-tabs :top="0" :isFixed="false" :tabs="segmentedList" :currentTab="curView" @change="tabChange"></tui-tabs>
				</view>
			</template>
			<view class="snowy-shadow snowy-z-paging-item snowy-padding snowy-hover" v-for="(item, index) in msgData" :key="index" @tap="tapMsg(item, index)">
				<uni-row>
					<uni-col :span="22">
						<view class="snowy-main-title snowy-text-bold snowy-text-ellipsis" :class="!!item.read ? 'snowy-color-grey': ''">{{item.subject}}</view>
					</uni-col>
					<uni-col :span="2">
						<view class="snowy-flex-end">
							<uni-icons v-show="!item.read" type="smallcircle-filled" size="10" color="#e43d33"></uni-icons>
						</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<view class="snowy-sub-title snowy-text-ellipsis">{{item.createTime}}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="24">
						<view class="snowy-sub-title snowy-text-ellipsis">
							{{item.content}}
						</view>
					</uni-col>
				</uni-row>
			</view>
		</z-paging>
	</view>
</template>
<script setup>
	import { nextTick, ref } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import userCenterApi from '@/api/sys/user-center-api'
	const curView = ref(0)
	const segmentedList = ref([])
	const messageCategoryList = uni.$snowy.tool.dictList('MESSAGE_CATEGORY')
	if (uni.$snowy.tool.isNotEmpty(messageCategoryList)) {
		messageCategoryList.forEach(item => {
			segmentedList.value.push({ name: item.text })
		})
	}
	const dataPagingRef = ref()
	const searchFormData = ref({})
	const msgData = ref([])
	const tabChange = (e) => {
		if (curView.value != e.index) {
			curView.value = e.index
			dataPagingRef.value.reload()
		}
	}
	const virtualListChange = (vList) => {
		msgData.value = vList;
	}
	// 加载数据
	const loadData = async (pageNo, pageSize) => {
		const parameter = {
			current: pageNo,
			size: pageSize
		}
		Object.assign(parameter, searchFormData.value)
		parameter.category = uni.$snowy.tool.isEmpty(messageCategoryList) ? '' : messageCategoryList[curView.value]?.value
		const data = await userCenterApi.userLoginUnreadMessagePage(parameter)
		dataPagingRef.value.complete(data?.records)
	}
	const tapMsg = (item) => {
		item.read = true
		uni.$snowy.tab.navigateTo(`/pages/msg/detail?id=${item.id}&createTime=${item.createTime}`)
	}
</script>
<style lang="scss" scoped>
	::v-deep .uni-row {
		/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
		display: block;
		/* #endif */
		margin: 10rpx;
	}
</style>