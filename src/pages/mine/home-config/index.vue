<template>
	<view class="snowy-page">
		<uni-notice-bar show-icon text="首页调整完成后,请重新登录,谢谢!" />
		<view class="snowy-shadow snowy-item snowy-hover" v-for="(item, index) in homeConfigs" :key="index" :index="index">
			<uni-row class="snowy-flex-v-center">
				<uni-col :span="2" @tap="moreOpt(item,index)">
					<uni-icons size="20" type="paperclip" color="#5677fc"></uni-icons>
				</uni-col>
				<uni-col :span="18" @tap="moreOpt(item,index)">
					<view class="item-left">{{item.name}}</view>
				</uni-col>
				<uni-col :span="4">
					<switch :checked="item.isShow" style="transform:scale(0.7)" @change="(e)=>switchChange(item, e)" />
				</uni-col>
			</uni-row>
		</view>
		<more ref="moreRef"></more>
	</view>
</template>
<script setup>
	import store from '@/store'
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import more from './more.vue'
	// 快捷用户菜单
	const homeConfigs = computed(() => {
		return store.getters.homeConfigs
	})
	const switchChange = (item, e) => {
		item.isShow = e.detail.value
		store.commit("SET_homeConfigs", homeConfigs.value)
	}
	const moreRef = ref()
	const moreOpt = (item, index) => {
		moreRef.value.open(homeConfigs.value, index)
	}
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
		padding: 15rpx;
	}
</style>