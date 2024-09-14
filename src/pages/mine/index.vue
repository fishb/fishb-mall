<template>
	<view class="snowy-page">
		<view class="header snowy-shadow">
			<uni-row>
				<uni-col :span="5">
					<image class="snowy-flex-vh-center avatar" v-if="userInfo?.avatar" :src="userInfo?.avatar" mode="aspectFit"></image>
				</uni-col>
				<uni-col :span="8">
					<view class="snowy-color-white" style="font-size: 40rpx;">{{userInfo?.name}}</view>
				</uni-col>
				<uni-col :span="10" textAlign="right" @tap="handleToInfo">
					<view class="snowy-flex-end snowy-color-white snowy-main-title">个人信息</view>
				</uni-col>
				<uni-col :span="1" @tap="handleToInfo">
					<view class="snowy-flex-end">
						<uni-icons type="right" color="white" size="15"></uni-icons>
					</view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item">
			<uni-grid :column="4" :showBorder="false">
				<uni-grid-item @tap="handleToHomeConfig">
					<view class="snowy-grid-center">
						<snowy-icon backgroundColor="#2979ff" type="home-filled" size="20" color="#FFFFFF">
						</snowy-icon>
						<text style="margin-top: 10rpx">首页设置</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @tap="handleBuilding">
					<view class="snowy-grid-center">
						<snowy-icon backgroundColor="#fa3534" type="flag-filled" size="20" color="#FFFFFF">
						</snowy-icon>
						<text style="margin-top: 10rpx">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @tap="handleBuilding">
					<view class="snowy-grid-center">
						<snowy-icon backgroundColor="#ff9900" type="flag-filled" size="20" color="#FFFFFF">
						</snowy-icon>
						<text style="margin-top: 10rpx">建设中</text>
					</view>
				</uni-grid-item>
				<uni-grid-item @tap="handleBuilding">
					<view class="snowy-grid-center">
						<snowy-icon backgroundColor="#19be6b" type="flag-filled" size="20" color="#FFFFFF">
						</snowy-icon>
						<text style="margin-top: 10rpx">建设中</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row @tap="handleToEditInfo">
				<uni-col :span="2">
					<uni-icons type="person-filled" color="#2979ff" size="20"></uni-icons>
				</uni-col>
				<uni-col :span="21">
					<view class="snowy-main-title">编辑资料</view>
				</uni-col>
				<uni-col :span="1">
					<uni-icons type="right" color="#2979ff" size="20"></uni-icons>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row @tap="handleToPwd">
				<uni-col :span="2">
					<uni-icons type="locked-filled" color="#fa3534" size="20"></uni-icons>
				</uni-col>
				<uni-col :span="21">
					<view class="snowy-main-title">修改密码</view>
				</uni-col>
				<uni-col :span="1">
					<uni-icons type="right" color="#2979ff" size="20"></uni-icons>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row @tap="handleLogout">
				<uni-col :span="2">
					<uni-icons type="paperplane-filled" color="#ff9900" size="20"></uni-icons>
				</uni-col>
				<uni-col :span="21">
					<view class="snowy-main-title">退出登录</view>
				</uni-col>
				<uni-col :span="1">
					<uni-icons type="right" color="#2979ff" size="20"></uni-icons>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>
<script setup>
	import store from '@/store/index'
	import { computed } from "vue"
	import config from '@/config'
	const userInfo = computed(() => {
		return store.getters.userInfo
	})
	const handleToInfo = () => {
		uni.navigateTo({
			url: '/pages/mine/info/index'
		})
	}
	const handleToEditInfo = () => {
		uni.navigateTo({
			url: '/pages/mine/info/edit'
		})
	}
	const handleToPwd = () => {
		uni.navigateTo({
			url: '/pages/mine/pwd/index'
		})
	}
	const handleToHomeConfig = () => {
		uni.navigateTo({
			url: '/pages/mine/home-config/index'
		})
	}
	const handleBuilding = () => {
		uni.showToast({
			title: '模块建设中'
		})
	}
	const handleLogout = () => {
		uni.$snowy.modal.confirm('确定注销并退出系统吗？').then(() => {
			// 退出
			store.dispatch('LogOut').then(() => {
				uni.$snowy.tab.reLaunch(config.NO_TOKEN_BACK_URL)
			})
		})
	}
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
	}

	@mixin circular {
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
	// 	background-color: #ffffff;
	}

	.header {
		background: $snowy-primary;
		margin-bottom: 15rpx;
		padding: 90rpx 25rpx;

		.avatar {
			@include circular;
			border: 4rpx solid #eaeaea;
		}
	}
</style>