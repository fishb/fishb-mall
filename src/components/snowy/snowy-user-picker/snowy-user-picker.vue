<template>
	<snowy-sel-picker v-bind="$attrs" :searchEnabled="true" :searchSeniorEnable="true" @getOptData="getOptData" @getSelData="getSelData">
		<template v-slot:search="data">
		</template>
		<template v-slot:option="data">
			<uni-row>
				<uni-col :span="4">
					<image style="width: 75rpx; height: 75rpx; border-radius: 10rpx;" :src="data?.item?.avatar || '/static/logo.png'" mode="widthFix"></image>
				</uni-col>
				<uni-col :span="20">
					<view class="snowy-text-bold">{{data?.item?.name}}</view>
					<view class="snowy-sub-title">
						{{ `${data?.item?.orgName} | ${data?.item?.positionName} | ${data?.item?.genderName}` }}
					</view>
				</uni-col>
			</uni-row>
		</template>
	</snowy-sel-picker>
</template>
<script setup>
	const emits = defineEmits(['update:modelValue', 'noFindKey', 'getSelData', 'getOptData', 'cancel', 'confirm', 'searchConfirm', 'searchClear'])
	const getSelData = (curSelDataKey, callback) => {
		emits('getSelData', curSelDataKey, callback)
	}
	const getOptData = (param, callback) => {
		emits('getOptData', param, callback)
	}
</script>
<style lang="scss" scoped>
</style>