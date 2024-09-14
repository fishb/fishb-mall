<template>
	<view class="snowy-shadow" style="margin-bottom: 20rpx;padding: 20rpx; background-color: #f5fff0" v-for="(item, index) in dataList" :key="index">
		<uni-row>
			<uni-col :span="24">
				<view class="snowy-flex-end">
					<icon type="clear" :size="20" color="#5677fc" @click="del(index)"></icon>
				</view>
			</uni-col>
		</uni-row>
		<uni-forms :key="index" :ref="`formRef${ index }`" :model="item" label-position="top" validate-trigger="submit" labelWidth="auto">
			<uni-forms-item label="机构" name="orgId" required :rules="[{ required: true, errorMessage: '请选择机构' }]">
				<snowy-tree-picker v-model="item.orgId" placeholder="请选择机构" @confirm="(data)=>{selectorFunction.org.confirm(data,index)}" @getTreeOptData="selectorFunction.org.getTreeOpt" :map="{key: 'id', parentKey: 'parentId', children: 'children', label: 'name'}">
				</snowy-tree-picker>
			</uni-forms-item>
			<uni-forms-item label="职位" name="positionId" required :rules="[{ required: true, errorMessage: '请选择职位' }]">
				<snowy-sel-picker :autoLoadOptData="isLoadPositionOptData[index]" :optDataRefresherEnabled="isLoadPositionOptData[index]" :map="{key: 'id', label: 'name'}" v-model="item.positionId" @getOptData="(param, callback) =>selectorFunction.position.getOptData(param, callback, index)" placeholder="请选择选择职位" :isPage="true" @getSelData="selectorFunction.position.getSelData">
				</snowy-sel-picker>
			</uni-forms-item>
			<uni-forms-item label="主管" name="directorId">
				<snowy-user-picker v-model="item.directorId" placeholder="请选择主管" :map="{key: 'id', label: 'name'}" @getOptData="selectorFunction.user.getOptData" :isPage="true" @getSelData="selectorFunction.user.getSelData">
				</snowy-user-picker>
			</uni-forms-item>
		</uni-forms>
	</view>
	<tui-button margin="50rpx 0 0 0" :preventClick="true" type="primary" @click="add">增加任职</tui-button>
</template>
<script setup>
	import bizUserApi from '@/api/biz/biz-user-api'
	import userCenterApi from '@/api/sys/user-center-api'
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import CallbackState from "@/enum/callback-state"
	const { proxy } = getCurrentInstance()
	const emits = defineEmits(['update:modelValue'])
	const props = defineProps({
		modelValue: {
			type: String,
			default: '',
			required: false
		},
	})
	// 数据列表
	const dataList = ref([])
	// 职位参数
	const isLoadPositionOptData = ref([])
	const positionSearchData = ref([])
	// 传递选择器需要的方法
	const selectorFunction = {
		// 组织
		org: {
			getTreeOpt: (param, callback) => bizUserApi.userOrgTreeSelector(param).then((data) => {
				callback({ state: CallbackState.SUCCESS, treeData: data })
			}),
			// 组织改变
			confirm: ({ curSelDataKey, curSelData }, index) => {
				// 重置职位数据
				dataList.value[index].positionId = null
				positionSearchData.value[index].orgId = curSelDataKey
				isLoadPositionOptData.value[index] = true
			},
		},
		// 职位
		position: {
			getOptData: async ({ pageNo, pageSize }, callback, index) => {
				const parameter = { current: pageNo, size: pageSize }
				Object.assign(parameter, positionSearchData.value[index])
				const data = await bizUserApi.userPositionSelector(parameter)
				callback({ state: CallbackState.SUCCESS, data: data?.records })
			},
			getSelData: async (curSelDataKey, callback) => {
				if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
					const data = await userCenterApi.getPositionListByIdList({ idList: [curSelDataKey] })
					callback({ state: CallbackState.SUCCESS, data: data[0] })
				}
			}
		},
		// 用户
		user: {
			getOptData: async ({ pageNo, pageSize, keyword }, callback) => {
				const parameter = { current: pageNo, size: pageSize, searchKey: keyword }
				const data = await bizUserApi.userSelector(parameter)
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
	const initData = () => {
		if (uni.$snowy.tool.isEmpty(props.modelValue)) {
			return dataList.value = []
		}
		Object.assign(dataList.value, JSON.parse(props.modelValue))
		dataList.value.forEach((item, index) => {
			positionSearchData.value[index] = {}
			if (uni.$snowy.tool.isEmpty(item.orgId)) {
				return
			}
			positionSearchData.value[index].orgId = item.orgId
			isLoadPositionOptData.value[index] = true
		})
	}
	initData()
	watch(() => props.modelValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			initData()
		}
	}, {
		deep: false,
		immediate: false
	})
	
	// 新增
	const add = () => {
		dataList.value.push({
			orgId: "",
			positionId: "",
			directorId: ""
		})
		positionSearchData.value.push({})
		isLoadPositionOptData.value.push(false)
	}
	// 删除
	const del = (index) => {
		dataList.value.splice(index, 1)
		positionSearchData.value.splice(index, 1)
		isLoadPositionOptData.value.splice(index, 1)
	}
	// 表单校验
	const formListEmitAndValidate = () => {
		// 更新数据
		if (dataList.value && dataList.value.length > 0) {
			emits('update:modelValue', JSON.stringify(dataList.value))
		}
		// 校验逻辑
		const promiseList = []
		dataList.value.forEach((item, index) => {
			promiseList.push(new Promise((resolve, reject) => {
				proxy.$refs[`formRef${ index }`][0].validate().then(result => {
					resolve(result)
				}).catch(err => {
					reject(err)
				})
			}))
		})
		return new Promise((resolve, reject) => {
			Promise.all(promiseList).then((result) => {
				resolve(result)
			}).catch(err => {
				reject(err)
			})
		})
	}
	defineExpose({
		formListEmitAndValidate
	})
</script>