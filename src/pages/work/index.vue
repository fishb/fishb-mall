<template>
	<view class="snowy-page">
		<!-- 轮播图 -->
		<uni-swiper-dot :info="data" :current="current" field="content">
			<swiper :current="swiperDotIndex" :autoplay="true" :interval="3000" :duration="1000" @change="changeSwiper">
				<swiper-item v-for="(item, index) in data" :key="index">
					<view @click="clickBannerItem(item)">
						<image style="width:100%; border-radius: 5rpx;" :src="item.image" mode="widthFix" :draggable="false" />
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<!-- 宫格组件 -->
		<view class="snowy-item snowy-shadow" v-for="(userMenu, i) in userMobileMenus" :index="i" :key="userMenu.id">
			<uni-section :title="userMenu.name">
				<template v-slot:decoration>
					<view style="margin-right: 5rpx;">
						<uni-icons custom-prefix="snowy" :type="userMenu.icon" size="16" :color="userMenu.color">
						</uni-icons>
					</view>
				</template>
				<template v-slot:right>
					<snowy-crumb :crumbData="allSelData[userMenu.id]" @clickCruItem="({ item, index })=>clickText(item,index, userMenu.id)"></snowy-crumb>
				</template>
			</uni-section>
			<view>
				<uni-grid :column="4" :showBorder="false">
					<uni-grid-item v-for="(item, j) in handleData(userMenu.id, userMenu.children)" :index="j" :key="handleKey(item,j)" @tap="gridItemClick(userMenu.id, item, j)">
						<view class="snowy-grid-center">
							<snowy-icon :backgroundColor="item.color" custom-prefix="snowy" :type="item.icon" size="20" color="#FFFFFF"></snowy-icon>
							<text class="snowy-text-center" style="margin-top: 10rpx">{{item.title}}</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
	</view>
</template>
<script setup>
	import store from '@/store'
	import config from '@/config'
	import { reactive, ref, getCurrentInstance } from "vue"
	import { prefixUrl } from "@/utils/api-adaptive"
	const { proxy } = getCurrentInstance()
	const current = ref(0)
	const swiperDotIndex = ref(0)
	const data = reactive([{
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper1.jpg`
	}, {
		image: `${store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl('/mobile/')}swiper/swiper2.jpg`
	}])
	const changeSwiper = (e) => {
		current.value = e.detail.current
	}
	const clickBannerItem = (item) => {
		console.log(item)
	}
	const userMobileMenus = store.getters.userMobileMenus
	// 当前选中的数据
	let selData = reactive({})
	// 所有选中的数据
	let allSelData = reactive({})
	if (userMobileMenus && userMobileMenus.length > 0) {
		userMobileMenus.forEach(item => {
			allSelData[item.id] = []
			allSelData[item.id].push(item)
			selData[item.id] = []
		})
	}
	const clickText = (item, index, userMenuId) => {
		// 菜单进行更新
		handleData(item.id, item.children).forEach(itemData => {
			itemData.key = itemData.key + 1
		})
		selData[userMenuId] = item.children
		// 已选中的部分数据进行删除
		allSelData[userMenuId].splice(index + 1, allSelData[userMenuId].length - index);
	}
	const handleData = (userMenuId, userMenuChildren) => {
		return selData[userMenuId] && selData[userMenuId].length > 0 ? selData[userMenuId] : userMenuChildren
	}
	const handleKey = (item, j) => {
		item.key = j
		return item.key
	}
	const gridItemClick = (userMenuId, item, j) => {
		if (item.children && item.children.length > 0) {
			// 菜单进行更新
			item.key = item.key + 1
			selData[userMenuId] = item.children
			// 向已选中的数据中添加新的数据
			allSelData[userMenuId].push(item)
		} else if (item.menuType == 'MENU') {
			uni.navigateTo({
				url: item.path,
				fail(error) {
					uni.$snowy.modal.alert('请将【' + item.title + '】的移动端路由地址(' + item.path + ')与uniapp的page.json的path路径对应！')
					console.error(error)
				}
			})
		} else if (item.menuType == 'IFRAME') {
			uni.navigateTo({
				url: `/pages/common/webview/index?url=${item.path}`,
			})
		} else if (item.menuType == 'LINK') {
			// #ifdef H5
			self.location.href = item.path
			// #endif
			// #ifndef H5
			uni.navigateTo({
				url: `/pages/common/webview/index?url=${item.path}`,
			})
			// #endif
		}
	}
</script>
<style lang="scss" scoped>
</style>