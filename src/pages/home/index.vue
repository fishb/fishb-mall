<template>
	<view class="snowy-page">
		<item v-for="(it, i) in homeConfigs" :index="i" :key="i" :code="it.code" :isShow="it.isShow"></item>
	</view>
</template>
<script setup>
	import Item from "./item.vue"
	import store from '@/store'
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	// 快捷用户菜单
	const homeConfigs = computed(() => {
		return store.getters.homeConfigs
	})
</script>
<style lang="scss" scoped>
</style>