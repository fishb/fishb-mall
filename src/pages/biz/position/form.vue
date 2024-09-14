<template>
	<view class="snowy-form">
		<uni-forms ref="formRef" :model="formData" label-position="top" label-width="auto" label-align="left">
			<uni-forms-item label="所属机构" name="orgId" required :rules="[{ required: true, errorMessage: '请选择所属机构' }]">
				<snowy-tree-picker v-model="formData.orgId" placeholder="请选择所属机构" @getTreeOptData="getOrgTreeOpt" :map="{key: 'id', parentKey: 'parentId', children: 'children', label: 'name'}">
				</snowy-tree-picker>
			</uni-forms-item>
			<uni-forms-item label="岗位名称" name="name" required :rules="[{ required: true, errorMessage: '请输入岗位名称' }]">
				<uni-easyinput v-model="formData.name" placeholder="请输入岗位名称"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="岗位分类" name="category" required :rules="[{ required: true, errorMessage: '请选择岗位分类' }]">
				<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.category" @getOptData="getPositionCategoryOptions" placeholder="请选择岗位分类"></snowy-sel-picker>
			</uni-forms-item>
			<uni-forms-item label="排序" name="sortCode" required :rules="[{ required: true, errorMessage: '请选择排序' }]">
				<uni-number-box v-model="formData.sortCode" background="#2979FF" color="#fff" :step="1" :max="100"></uni-number-box>
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
	import bizPositionApi from '@/api/biz/biz-position-api'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import CallbackState from "@/enum/callback-state"
	const formRef = ref()
	const formData = ref({
		sortCode: 99
	})
	const getOrgTreeOpt = (param, callback) => bizPositionApi.positionOrgTreeSelector(param).then((data) => callback({ state: CallbackState.SUCCESS, treeData: data }))
	const getPositionCategoryOptions = (param, callback) => callback({ state: CallbackState.SUCCESS, data: uni.$snowy.tool.dictList('POSITION_CATEGORY') })
	// 动态表单
	const dynamicFormRef = ref()
	const dynamicFieldConfigList = ref([])
	const dynamicFormData = ref({})
	if (config.IS_ENTTERPRISE) {
		bizPositionApi.positionDynamicFieldConfigList().then(data => {
			dynamicFieldConfigList.value = data || []
		})
	}
	// 加載
	onLoad(async (option) => {
		if (!option.id) {
			return
		}
		const data = await bizPositionApi.positionDetail({ id: option.id })
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
			const data = await bizPositionApi.submitForm(formData.value, !formData.value.id)
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