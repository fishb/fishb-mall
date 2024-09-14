<template>
	<uni-popup ref="popRef" type="bottom" background-color="transparent" maskBackgroundColor="rgba(0, 0, 0, 0.6)">
		<view class="snowy-shadow snowy-padding container">
			<view class="snowy-flex-end">
				<icon type="clear" :size="20" color="#5677fc" @click="close"></icon>
			</view>
			<uni-forms ref="formRef" :model="formData" label-position="top" labelWidth="auto">
				<uni-forms-item label="时间" name="scheduleTime" :required="true" :rules="[{ required: true, errorMessage: '请选择时间' }]">
					<picker mode="time" :value="formData.scheduleTime" @change="(e)=>{formData.scheduleTime = e.detail.value}">
						<view class="uni-input input-value-border">
							{{formData.scheduleTime?formData.scheduleTime:"请选择时间"}}
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item label="日程描述" name="scheduleContent" :required="true" :rules="[{ required: true, errorMessage: '请输入日程描述' }]">
					<uni-easyinput type="textarea" v-model="formData.scheduleContent" placeholder="请输入日程描述"></uni-easyinput>
				</uni-forms-item>
			</uni-forms>
			<tui-button height="90rpx" type="primary" @click="submit">确认</tui-button>
		</view>
	</uni-popup>
</template>
<script setup>
	import { ref } from "vue"
	import indexApi from '@/api/sys/index-api'
	const popRef = ref()
	const formRef = ref()
	const formData = ref({})
	const emit = defineEmits({
		ok: null
	})
	const onOpen = (scheduleDate) => {
		formData.value.scheduleDate = scheduleDate
		popRef.value.open()
	}
	const submit = () => {
		formRef.value.validate().then(async () => {
			const data = await indexApi.indexScheduleAdd(formData.value)
			emit('ok', data)
			popRef.value.close()
			formData.value = {}
		})
	}
	const close = () => {
		popRef.value.close()
	}
	defineExpose({
		onOpen
	})
</script>
<style lang="scss" scoped>
	.container {
		/* #ifdef H5 */
		margin: 0 0 110rpx 0;
		/* #endif */
		/* #ifndef H5 */
		margin: 0 0 15rpx 0;
		/* #endif */

		.uni-input {
			height: 50rpx;
			padding: 15rpx 25rpx;
			line-height: 50rpx;
			font-size: 28rpx;
			background: #FFF;
			flex: 1;
		}

		.input-value-border {
			border: 1px solid #EDEDED;
			border-radius: 5upx;
		}

		.btn-sub {
			background-color: #5677fc;
		}
	}
</style>