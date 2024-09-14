<template>
	<view class="snowy-form">
		<uni-forms ref="formRef" :model="formData" label-position="top" label-width="auto" label-align="left">
			<uni-forms-item label="上级机构" name="parentId" required :rules="[{ required: true, errorMessage: '请选择上级机构' }]">
				<snowy-tree-picker v-model="formData.parentId" :isTopLevel="true" placeholder="请选择上级机构" @getTreeOptData="selectorFunction.getOrgTreeOpt" :map="{key: 'id', parentKey: 'parentId', children: 'children', label: 'name'}">
				</snowy-tree-picker>
			</uni-forms-item>
			<uni-forms-item label="机构名称" name="name" required :rules="[{ required: true, errorMessage: '请输入机构名称' }]">
				<uni-easyinput v-model="formData.name" placeholder="请输入机构名称"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="机构分类" name="category" required :rules="[{ required: true, errorMessage: '请选择机构分类' }]">
				<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.category" @getOptData="selectorFunction.getOrgCategoryOpt" placeholder="请选择机构分类"></snowy-sel-picker>
			</uni-forms-item>
			<uni-forms-item label="排序" name="sortCode" required :rules="[{ required: true, errorMessage: '请选择排序' }]">
				<uni-number-box v-model="formData.sortCode" background="#2979FF" color="#fff" :step="1" :max="100"></uni-number-box>
			</uni-forms-item>
			<uni-forms-item label="指定主管" name="directorId">
				<snowy-user-picker v-model="formData.directorId" placeholder="请选择主管" :map="{key: 'id', label: 'name'}" @getOptData="selectorFunction.user.getOptData" :isPage="true" @getSelData="selectorFunction.user.getSelData">
				</snowy-user-picker>
			</uni-forms-item>
		</uni-forms>
		<uni-forms ref="dynamicFormRef" :model="dynamicFormData" label-position="top" label-width="auto" label-align="left">
			<snowy-dyna-field v-for="(item, index) in dynamicFieldConfigList" :key="index" :index="index" :fieldConfig="item" :formData="dynamicFormData" />
		</uni-forms>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
	</view>
</template>
<script setup>
	import config from '@/config'
	import { nextTick, reactive, ref } from "vue"
	import bizOrgApi from '@/api/biz/biz-org-api'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import userCenterApi from '@/api/sys/user-center-api'
	import CallbackState from "@/enum/callback-state"
	const formRef = ref()
	const formData = ref({
		sortCode: 99
	})
	const selectorFunction = {
		getOrgTreeOpt: (param, callback) => bizOrgApi.orgTree(param).then((data) => callback({ state: CallbackState.SUCCESS, treeData: data })),
		getOrgCategoryOpt: (param, callback) => callback({ state: CallbackState.SUCCESS, data: uni.$snowy.tool.dictList('ORG_CATEGORY') }),
		// 用户
		user: {
			getOptData: async ({ pageNo, pageSize, keyword }, callback) => {
				const parameter = { current: pageNo, size: pageSize, searchKey: keyword }
				const data = await bizOrgApi.orgUserSelector(parameter)
				callback({ state: CallbackState.SUCCESS, data: data?.records })
			},
			getSelData: async (curSelDataKey, callback) => {
				if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
					const data = await userCenterApi.userCenterGetUserListByIdList({
						idList: [curSelDataKey]
					})
					callback({ state: CallbackState.SUCCESS, data: data[0] })
				}
			}
		},
	}
	// 动态表单
	const dynamicFormRef = ref()
	const dynamicFieldConfigList = ref([])
	const dynamicFormData = ref({})
	if (config.IS_ENTTERPRISE) {
		bizOrgApi.orgDynamicFieldConfigList().then(data => {
			dynamicFieldConfigList.value = data || []
		})
	}
	// 加載
	onLoad(async (option) => {
		if (!option.id) {
			return
		}
		const data = await bizOrgApi.orgDetail({ id: option.id })
		formData.value = data
		dynamicFormData.value = JSON.parse(formData.value.extJson) || {}
	})
	const submit = () => {
		const promiseList = []
		promiseList.push(new Promise((resolve, reject) => {
			formRef.value.validate().then((result) => {
				resolve(result)
			}).catch((err) => {
				reject(err)
			})
		}))
		promiseList.push(new Promise((resolve, reject) => {
			dynamicFormRef.value.validate().then((result) => {
				resolve(result)
			}).catch((err) => {
				reject(err)
			})
		}))
		Promise.all(promiseList).then(async () => {
			formData.value.extJson = JSON.stringify(dynamicFormData.value)
			const data = await bizOrgApi.submitForm(formData.value, !formData.value.id)
			uni.$snowy.tool.setRefresh({
				key: "formBack"
			})
			uni.navigateBack({
				delta: 1
			})
		})
	}
</script>
<style lang="scss" scoped>
</style>