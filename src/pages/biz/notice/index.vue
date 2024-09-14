<template>
	<view>
		<z-paging ref="dataPagingRef" :fixed="true" use-virtual-list :force-close-inner-list="true" cell-height-mode="dynamic" @virtualListChange="virtualListChange" @query="loadData" :auto="true">
			<template #top>
				<view class="snowy-z-paging-item">
					<snowy-search placeholder="请输入标题" v-model="searchFormData.title" @confirm="$refs.dataPagingRef.reload()" @clear="$refs.dataPagingRef.reload()" :seniorEnable="true" @seniorSearch="$refs.searchRef.open()"></snowy-search>
				</view>
				<search ref="searchRef" :searchFormData="searchFormData" @confirm="$refs.dataPagingRef.reload()"></search>
			</template>
			<view class="snowy-shadow snowy-z-paging-item snowy-padding snowy-hover" v-for="(item, index) in bizNoticeData" :key="index" @tap="tapNotice(item)">
				<uni-row>
					<uni-col :span="7">
						<image v-if="item.image" style="width: 180rpx; height: 120rpx;" :src="item.image" mode="aspectFill"></image>
					</uni-col>
					<uni-col :span="15">
						<uni-row>
							<uni-col :span="4">
								<view class="snowy-main-title snowy-text-bold snowy-text-ellipsis" :style="{color: item.type==='NOTICE' ? '#18bc37' : item.type==='ANNOUNCEMENT' ? '#5677fc' : '#f3a73f'  }">
									{{$xeu.find(bizNoticeType, i => i.value === item.type)?.text}}
								</view>
							</uni-col>
							<uni-col :span="20">
								<view class="snowy-main-title snowy-text-bold snowy-text-ellipsis">{{item.title}}</view>
							</uni-col>
						</uni-row>
						<uni-row>
							<uni-col :span="24">
								<view class="snowy-sub-title snowy-text-bold snowy-text-ellipsis">{{item.digest}}</view>
							</uni-col>
						</uni-row>
						<uni-row>
							<uni-col :span="24">
								<view class="snowy-sub-title snowy-text-bold snowy-text-ellipsis">{{item.createTime}}</view>
							</uni-col>
						</uni-row>
					</uni-col>
					<uni-col :span="2">
						<view class="snowy-flex-end">
							<uni-icons type="forward" size="20"></uni-icons>
						</view>
					</uni-col>
				</uni-row>
			</view>
		</z-paging>
	</view>
</template>
<script setup>
	import { onLoad, onShow, onReady, onPullDownRefresh } from "@dcloudio/uni-app"
	import { reactive, ref, getCurrentInstance } from "vue"
	import bizNoticeApi from '@/api/biz/biz-notice-api'
	import search from './search.vue'
	const bizNoticeType = uni.$snowy.tool.dictList('BIZ_NOTICE_TYPE')
	const dataPagingRef = ref()
	const searchFormData = ref({})
	const bizNoticeData = ref([])
	const virtualListChange = (vList) => {
		bizNoticeData.value = vList
	}
	const loadData = async (pageNo, pageSize) => {
		const parameter = {
			current: pageNo,
			size: pageSize,
			place: "BACK_MOBILE",
			status: "ENABLE",
		}
		Object.assign(parameter, searchFormData.value)
		if(uni.$snowy.tool.isNotEmpty(parameter.createTime)){
			parameter.startCreateTime = parameter.createTime[0]
			parameter.endCreateTime = parameter.createTime[1]
		}
		const data = await bizNoticeApi.page(parameter)
		dataPagingRef.value.complete(data?.records)
	}
	// 展示
	onShow(() => {
		uni.$snowy.tool.refresh(() => {
			nextTick(() => {
				dataPagingRef.value.reload()
			})
		}, {
			key: "formBack"
		})
	})
	const tapNotice = (item) =>{
		uni.$snowy.tab.navigateTo(`/pages/biz/notice/detail?id=${item.id}`)
	}
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
		padding: 5rpx;
	}
</style>