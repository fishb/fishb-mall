<template>
	<uni-popup ref="popRef" type="bottom" background-color="transparent" maskBackgroundColor="rgba(0, 0, 0, 0.6)">
		<view class="snowy-shadow snowy-padding">
			<view class="snowy-flex-end">
				<icon type="clear" :size="20" color="#5677fc" @click="close"></icon>
			</view>
			<uni-forms ref="formRef" :model="searchFormData" label-position="top" labelWidth="auto">
				<uni-forms-item label="标题" name="title">
					<uni-easyinput v-model="searchFormData.title" placeholder="请输入标题"></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="类型" name="type">
					<uni-data-checkbox v-model="searchFormData.type" :localdata="typeOpts" :map="{text:'text',value:'value'}" mode="tag" />
				</uni-forms-item>
				<uni-forms-item label="创建时间" name="createTime">
					<uni-datetime-picker v-model="searchFormData.createTime" type="datetimerange" return-type="string" :clear-icon="true"></uni-datetime-picker>
				</uni-forms-item>
			</uni-forms>
			<uni-row :gutter="10">
				<uni-col :span="12">
					<tui-button height="90rpx" type="gray" @click="reset">重置</tui-button>
				</uni-col>
				<uni-col :span="12">
					<tui-button height="90rpx" type="primary" @click="confirm">确认</tui-button>
				</uni-col>
			</uni-row>
		</view>
	</uni-popup>
</template>
<script setup>
	import { ref, reactive } from "vue"
	import CallbackState from "@/enum/callback-state"
	const emits = defineEmits(['reset', 'confirm'])
	const props = defineProps({
		searchFormData: {
			type: Object,
			required: true
		},
	})
	const popRef = ref()
	const open = () => {
		popRef.value.open()
	}
	const typeOpts = uni.$snowy.tool.dictList('BIZ_NOTICE_TYPE')
	const placeOpts = uni.$snowy.tool.dictList('BIZ_NOTICE_PLACE')
	const reset = () => {
		props.searchFormData.title = ''
		props.searchFormData.type = ''
		props.searchFormData.createTime = []
		emits('reset', props.searchFormData)
	}
	const confirm = () => {
		popRef.value.close()
		emits('confirm', props.searchFormData)
	}
	const close = () => {
		popRef.value.close()
	}
	defineExpose({
		open
	})
</script>
<style lang="scss" scoped>
</style>