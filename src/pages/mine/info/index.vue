<template>
	<view class="snowy-page">
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">账户</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.account }} </view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">姓名</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.name }} </view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">手机</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.phone }} </view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">昵称</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.nickname }} </view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">性别</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.gender }} </view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">生日</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.birthday }} </view>
				</uni-col>
			</uni-row>
		</view>
		<view class="snowy-shadow snowy-item snowy-padding">
			<uni-row>
				<uni-col :span="2">
					<uni-icons size="18" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="10">
					<view class="snowy-sub-title">邮箱</view>
				</uni-col>
				<uni-col :span="12">
					<view class="snowy-text-right snowy-text-bold snowy-text-ellipsis"> {{ userInfo.email }} </view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>
<script setup>
	import { reactive, ref, computed } from "vue"
	import store from '@/store/index.js'
	const userInfo = computed(() => {
		return store.getters.userInfo
	})
</script>
<style lang="scss" scoped>
</style>