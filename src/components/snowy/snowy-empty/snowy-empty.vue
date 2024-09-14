<template>
	<tui-no-data v-bind="$attrs" :fixed="$attrs.fixed ? $attrs.fixed : false" :imgUrl="$attrs.imgUrl? $attrs.imgUrl: image.base64Empty">
		<slot><view class="snowy-color-grey">没有数据哦~</view></slot>
	</tui-no-data>
</template>
<script setup>
	import image from '@/static/js/image'
</script>
<style lang="scss" scoped>
</style>