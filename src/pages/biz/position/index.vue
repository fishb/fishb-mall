<template>
	<view>
		<z-paging ref="dataPagingRef" :fixed="true" use-virtual-list :force-close-inner-list="true" cell-height-mode="dynamic" @virtualListChange="virtualListChange" @query="loadData" :auto="true">
			<template #top>
				<view class="snowy-z-paging-item">
					<snowy-search placeholder="请输入关键字" v-model="searchFormData.searchKey" @confirm="$refs.dataPagingRef.reload()" @clear="$refs.dataPagingRef.reload()"></snowy-search>
				</view>
				<view class="snowy-z-paging-item snowy-shadow">
					<snowy-crumb :crumbData="allSelOrg" @clickCruItem="clickOrgCru"></snowy-crumb>
				</view>
			</template>
			<!-- 组织 -->
			<view class="snowy-shadow snowy-z-paging-item snowy-padding snowy-hover" v-for="(item, index) in curSelOrg" :key="index" @tap="tapOrg(item, index)">
				<uni-row>
					<uni-col :span="4">
						<view v-show="'COMPANY' === item?.category">
							<image style="width: 80rpx; height: 80rpx;" src="/static/svg/org/company.svg" mode="widthFix"></image>
						</view>
						<view v-show="'DEPT' === item?.category">
							<image style="width: 80rpx; height: 80rpx;" src="/static/svg/org/department.svg" mode="widthFix"></image>
						</view>
					</uni-col>
					<uni-col :span="18">
						<view>{{item.name}}</view>
					</uni-col>
					<uni-col :span="2">
						<view class="snowy-flex-end" v-if="item.children">
							<uni-icons type="forward" size="20"></uni-icons>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<!-- 职位 -->
			<view class="snowy-shadow snowy-z-paging-item snowy-padding snowy-hover" v-for="(item, index) in positionData" :id="`zp-id-${item.zp_index}`" :key="item.zp_index" @tap="$refs.moreRef.open(item)">
				<uni-row>
					<uni-col :span="4">
						<view v-if="item.category == 'HIGH'">
							<snowy-icon backgroundColor="#f3a73f" type="vip-filled" size="20" color="#FFFFFF"></snowy-icon>
						</view>
						<view v-else-if="item.category == 'MIDDLE'">
							<snowy-icon backgroundColor="#2979ff" type="auth-filled" size="20" color="#FFFFFF"></snowy-icon>
						</view>
						<view v-else>
							<snowy-icon backgroundColor="#18bc37" type="staff-filled" size="20" color="#FFFFFF"></snowy-icon>
						</view>
					</uni-col>
					<uni-col :span="6">
						<view>{{item.name}}</view>
					</uni-col>
					<uni-col :span="14">
						<view class="snowy-flex-end snowy-text-ellipsis" style="color: #999;">
							{{ $snowy.tool.dictTypeData('POSITION_CATEGORY', item.category)}}
						</view>
					</uni-col>
				</uni-row>
			</view>
		</z-paging>
		<!-- 新增 -->
		<snowy-float-btn v-if="$snowy.hasPerm('mobileBizPositionAdd')" @click="add"></snowy-float-btn>
		<!-- 更多 -->
		<more ref="moreRef" @handleOk="$refs.dataPagingRef.reload()"></more>
	</view>
</template>
<script setup>
	import bizOrgApi from '@/api/biz/biz-org-api'
	import bizPositionApi from '@/api/biz/biz-position-api'
	import { reactive, ref, getCurrentInstance, nextTick } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import more from '@/pages/biz/position/more.vue'
	// 所有选择的机构
	const allSelOrg = ref([])
	// 当前选择的机构
	const curSelOrg = ref([])
	bizOrgApi.orgTree().then(data => {
		curSelOrg.value = data || []
		allSelOrg.value.push({
			id: '0',
			name: '全部',
			children: data || []
		})
	})
	const dataPagingRef = ref()
	const searchFormData = ref({})
	const positionData = ref([])
	const virtualListChange = (vList) => {
		positionData.value = vList;
	}
	// 加载数据
	const loadData = async (pageNo, pageSize) => {
		const parameter = {
			current: pageNo,
			size: pageSize
		}
		Object.assign(parameter, searchFormData.value)
		const data = await bizPositionApi.positionPage(parameter)
		dataPagingRef.value.complete(data?.records)
	}
	// 点击机构面包屑
	const clickOrgCru = ({ item, index }) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))
		searchFormData.value.orgId = (item.id === '0' ? '' : item.id)
		dataPagingRef.value.reload()
	}
	// 点击机构
	const tapOrg = (item, index) => {
		curSelOrg.value = item.children
		allSelOrg.value.push(item)
		searchFormData.value.orgId = item.id
		dataPagingRef.value.reload()
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
	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/position/form'
		})
	}
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
	}
</style>