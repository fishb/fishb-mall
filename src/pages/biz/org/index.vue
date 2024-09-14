<template>
	<view class="snowy-page">
		<view class="snowy-shadow snowy-item">
			<snowy-crumb :crumbData="allSelOrg" @clickCruItem="clickOrgCru"></snowy-crumb>
		</view>
		<!-- 组织 -->
		<view class="snowy-shadow snowy-item snowy-hover" v-for="(item, index) in curSelOrg" :key="index" @tap="tapOrg(item, index)">
			<tui-swipe-action :actions="actions" :params="item" @click="handlerButton">
				<template v-slot:content>
					<uni-row>
						<uni-col :span="4">
							<view v-show="'COMPANY' === item?.category">
								<image style="width: 80rpx; height: 80rpx;" src="/static/svg/org/company.svg" mode="widthFix"></image>
							</view>
							<view v-show="'DEPT' === item?.category">
								<image style="width: 80rpx; height: 80rpx;" src="/static/svg/org/department.svg" mode="widthFix"></image>
							</view>
						</uni-col>
						<uni-col :span="15">
							<view>{{item.name}}</view>
						</uni-col>
						<uni-col :span="5">
							<view class="snowy-flex-end" v-if="item.children">
								<uni-icons type="forward" size="20"></uni-icons>
							</view>
						</uni-col>
					</uni-row>
				</template>
			</tui-swipe-action>
		</view>
		<snowy-empty v-show="$snowy.tool.isEmpty(curSelOrg)" />
		<snowy-float-btn v-if="$snowy.hasPerm('mobileBizOrgAdd')" @click="add"></snowy-float-btn>
	</view>
</template>
<script setup>
	import bizOrgApi from '@/api/biz/biz-org-api'
	import { reactive, ref, getCurrentInstance, nextTick, computed } from "vue";
	import { onLoad, onShow, onReady, onPullDownRefresh } from "@dcloudio/uni-app"
	// 所有选择的机构
	const allSelOrg = ref([])
	// 当前选择的机构
	const curSelOrg = ref([])
	// 加载标识
	const isLoading = ref(false)
	const loadData = async () => {
		isLoading.value = true
		const data = await bizOrgApi.orgTree()
		curSelOrg.value = data || []
		allSelOrg.value = [{
			id: '0',
			name: '全部',
			children: data || []
		}]
		isLoading.value = false
	}
	loadData()
	// 展示
	onShow(() => {
		uni.$snowy.tool.refresh(() => {
			nextTick(() => {
				loadData()
			})
		}, {
			key: "formBack"
		})
	})
	const clickOrgCru = ({ item, index }) => {
		curSelOrg.value = item.children
		allSelOrg.value.splice(index + 1, allSelOrg.value.length - (index + 1))
	}
	const tapOrg = (item, index) => {
		if (item.children) {
			curSelOrg.value = item.children
			allSelOrg.value.push(item)
		}
	}
	// 新增悬浮按钮
	const add = () => {
		uni.navigateTo({
			url: '/pages/biz/org/form'
		})
	}
	const actions = []
	if (uni.$snowy.hasPerm(['mobileBizOrgEdit'])) {
		actions.push({
			name: '修改',
			color: '#fff',
			fontsize: 30,
			width: 70,
			background: '#5677fc'
		})
	}
	if (uni.$snowy.hasPerm(['mobileBizOrgDelete'])) {
		actions.push({
			name: '删除',
			color: '#fff',
			fontsize: 30,
			width: 70,
			background: '#FD3B31'
		})
	}
	const handlerButton = ({ index, item }) => {
		if ('修改' === actions[index]?.name) {
			return uni.navigateTo({
				url: '/pages/biz/org/form?id=' + item.id
			})
		}
		if ('删除' === actions[index]?.name) {
			return uni.$snowy.modal.confirm(`是否确认删除【${ item.name }】机构？`).then(() => {
				bizOrgApi.orgDelete([{
					id: item.id
				}]).then(data => {
					loadData()
				})
			})
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
		padding: 15rpx;
	}
</style>