<template>
	<view class="snowy-form">
		<uni-forms ref="formRef" :model="formData" label-position="top" labelWidth="auto">
			<uni-forms-item label="环境KEY" name="key" required :rules="[{ required: true, errorMessage: '请输入环境唯一标识' }]">
				<uni-easyinput :disabled="isEdit" v-model="formData.key" placeholder="环境唯一标识|不可修改"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="环境名称" name="name" required :rules="[{ required: true, errorMessage: '请输入环境名称' }]">
				<uni-easyinput v-model="formData.name" placeholder="中文标识"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="服务端baseUrl" name="baseUrl" required :rules="[{ required: true, errorMessage: '请输入服务端baseUrl' }]">
				<uni-easyinput v-model="formData.baseUrl" placeholder="服务端baseUrl"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="主租户域" name="mainTenantDomain" required :rules="[{ required: true, errorMessage: '请输入主租户域' }]">
				<uni-easyinput v-model="formData.mainTenantDomain" placeholder="请输入主租户域"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="当前租户域" name="tenantDomain" required :rules="[{ required: true, errorMessage: '请输入当前租户域' }]">
				<uni-easyinput v-model="formData.tenantDomain" placeholder="请输入当前租户域"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="是否开启登录切换租户域" name="loginSwitchTenant" required :rules="[{ required: true, errorMessage: '是否开启登录切换租户域' }]">
				<switch :checked="formData.loginSwitchTenant" @change="(e)=>{formData.loginSwitchTenant = e.detail.value}" />
			</uni-forms-item>
		</uni-forms>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
	</view>
</template>
<script setup>
	import { nextTick, reactive, ref, computed } from "vue"
	import store from '@/store'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	const formRef = ref()
	const formData = ref({})
	const isEdit = ref(false)
	const allEnv = computed(() => {
		return store.getters.allEnv
	})
	// 加載
	onLoad((option) => {
		if (!option.key) {
			return
		}
		formData.value = {
			key: option.key,
			...allEnv.value[option.key]
		}
		isEdit.value = true
	})
	const submit = () => {
		formRef.value.validate().then(res => {
			let obj = uni.$xeu.clone(allEnv.value, true)
			obj[formData.value.key] = {
				name: formData.value.name,
				baseUrl: formData.value.baseUrl,
				mainTenantDomain: formData.value.mainTenantDomain,
				tenantDomain: formData.value.tenantDomain,
				loginSwitchTenant: formData.value.loginSwitchTenant,
			}
			store.commit('SET_allEnv', obj)
			uni.navigateBack({
				delta: 1
			})
		})
	}
</script>
<style lang="scss" scoped>
</style>