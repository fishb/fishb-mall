<template>
	<view class="snowy-page">
		<snowy-search v-model="searchName" :seniorEnable="true">
			<view @click="resetEnv">
				<text> 重置\n环境 </text>
			</view>
		</snowy-search>
		<view class="snowy-shadow snowy-item snowy-padding snowy-hover" v-for="(item, key) in filterEnv(allEnv)" :key="key" :index="key">
			<view @tap="switchEnv(key)" class="snowy-shadow snowy-item snowy-padding">
				<uni-row>
					<uni-col :span="12">
						<uni-icons v-if="key === envKey" size="20" type="circle-filled" color="#007AFF"></uni-icons>
						<uni-icons v-else size="20" type="circle"></uni-icons>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end snowy-text-bold snowy-text-ellipsis"> {{item.name}} </view>
					</uni-col>
				</uni-row>
			</view>
			<view @tap="$refs.moreRef.open({key:key, ...item})" class="snowy-item snowy-padding">
				<uni-row>
					<uni-col :span="12">
						<view class="snowy-sub-title">环境KEY：</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end snowy-text-bold snowy-text-ellipsis"> {{ key }} </view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="12">
						<view class="snowy-sub-title">服务端BaseUrl：</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end snowy-text-bold snowy-text-ellipsis"> {{item.baseUrl}} </view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="12">
						<view class="snowy-sub-title">主租户域：</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end snowy-text-bold snowy-text-ellipsis"> {{item.mainTenantDomain}} </view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="12">
						<view class="snowy-sub-title">当前租户域：</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end snowy-text-bold snowy-text-ellipsis"> {{item.tenantDomain}} </view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="12">
						<view class="snowy-sub-title">登录切换租户域：</view>
					</uni-col>
					<uni-col :span="12">
						<view class="snowy-flex-end snowy-text-bold snowy-text-ellipsis"> {{item.loginSwitchTenant?'开启':'关闭'}} </view>
					</uni-col>
				</uni-row>
			</view>
		</view>
		<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="loginBtn">确认</tui-button>
		<snowy-float-btn @click="add"></snowy-float-btn>
		<more ref="moreRef"></more>
	</view>
</template>
<script setup>
	import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
	import store from '@/store'
	import more from './more.vue'
	import env from '@/env'
	const searchName = ref('')
	const envKey = computed(() => {
		return store.getters.envKey
	})
	const allEnv = computed(() => {
		return store.getters.allEnv
	})
	// 过滤
	const filterEnv = (allEnv) => {
		const obj = {}
		uni.$xeu.objectEach(allEnv, (item, key) => {
			if (!searchName.value || item.name.indexOf(searchName.value) != -1) {
				obj[key] = item
			}
		})
		return obj
	}
	// 重置
	const resetEnv = () => {
		store.commit('SET_envKey', env.DEFAULT_ENV_KEY)
		store.commit('SET_allEnv', env.DEFAULT_ALL_ENV)
		store.commit('SET_tenantDomain', env.DEFAULT_ALL_ENV[env.DEFAULT_ENV_KEY].tenantDomain)
	}
	// 切换
	const switchEnv = (key) => {
		// 设置当前环境key
		store.commit('SET_envKey', key)
		// 设置当前租户
		store.commit('SET_tenantDomain', store.getters.allEnv[store.getters.envKey].tenantDomain)
	}
	const loginBtn = () => {
		uni.reLaunch({
			url: '/pages/login'
		})
	}
	// 新增
	const add = () => {
		uni.navigateTo({
			url: '/pages/config/form'
		})
	}
</script>
<style lang="scss" scoped>
	::v-deep .uni-row {
		margin: 15rpx;
	}
</style>