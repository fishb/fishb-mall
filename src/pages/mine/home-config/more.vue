<template>
	<uni-popup ref="popRef" type="bottom" background-color="transparent" maskBackgroundColor="rgba(0, 0, 0, 0.6)">
		<tui-list-view unlined="all" background-color="transparent">
			<tui-list-cell v-if="confIndex != 0" :hover="true" :arrow="false" @click="up" :radius="10">
				<view class="snowy-text-center"> 上移 </view>
			</tui-list-cell>
			<tui-list-cell v-if="confIndex != configs.length-1" :hover="true" :arrow="false" @click="down" :radius="10" :margin-top="2">
				<view class="snowy-text-center"> 下移 </view>
			</tui-list-cell>
			<tui-list-cell :hover="true" :arrow="false" @click="cancel" :margin-top="10" :radius="10">
				<view class="snowy-text-center"> 取消 </view>
			</tui-list-cell>
		</tui-list-view>
	</uni-popup>
</template>
<script setup>
	import store from '@/store'
	import { reactive, ref, getCurrentInstance } from "vue"
	const popRef = ref()
	const configs = ref([])
	const confIndex = ref()
	const open = (data, index) => {
		configs.value = data
		confIndex.value = index
		popRef.value.open()
	}
	// 上移
	const up = () => {
		swapArray(configs.value, confIndex.value - 1, confIndex.value)
		store.commit("SET_homeConfigs", configs.value)
		popRef.value.close()
	}
	// 下移
	const down = () => {
		swapArray(configs.value, confIndex.value, confIndex.value + 1)
		store.commit("SET_homeConfigs", configs.value)
		popRef.value.close()
	}
	//数组元素互换位置
	const swapArray = (arr, index1, index2) => {
		arr[index1] = arr.splice(index2, 1, arr[index1])[0];
		return arr;
	}
	// 取消
	const cancel = () => {
		popRef.value.close()
	}
	defineExpose({
		open
	})
</script>
<style lang="scss" scoped>
	.container {
		padding: 5upx;
		background-color: transparent;

		.item {
			text-align: center;
		}
	}
</style>