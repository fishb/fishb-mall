<template>
	<view>
		<uni-forms-item
			v-if="['input','textarea','number',].includes(fieldConfig?.type)"
			:label="fieldConfig?.label"
			:name="fieldConfig?.name" 
			:required="!!fieldConfig?.required"
			:rules="[{ required: !!fieldConfig?.required, errorMessage: fieldConfig?.placeholder || `请输入${fieldConfig?.label}` }]">
			<uni-easyinput
				:type="fieldConfig?.type"
				v-model="formData[fieldConfig?.name]"
				:placeholder="fieldConfig?.placeholder"
				v-bind="$attrs"/>
		</uni-forms-item>
		<uni-forms-item
			v-if="['radio','checkbox',].includes(fieldConfig?.type)"
			:label="fieldConfig?.label"
			:name="fieldConfig?.name" 
			:required="!!fieldConfig?.required"
			:rules="[{ required: !!fieldConfig?.required, errorMessage: fieldConfig?.placeholder || `请选择${fieldConfig?.label}` }]">
			<uni-data-checkbox
				v-model="formData[fieldConfig?.name]"
				:multiple="'checkbox' === fieldConfig?.type"
				:map="{text:'text',value:'value'}"
				:localdata="options"
				v-bind="$attrs"/>
		</uni-forms-item>
		<uni-forms-item
			v-if="['select',].includes(fieldConfig?.type)"
			:label="fieldConfig?.label"
			:name="fieldConfig?.name" 
			:required="!!fieldConfig?.required"
			:rules="[{ required: !!fieldConfig?.required, errorMessage: fieldConfig?.placeholder || `请选择${fieldConfig?.label}` }]">
			<snowy-sel-picker
				v-model="formData[fieldConfig?.name]"
				:placeholder="fieldConfig?.placeholder"
				:isMultiple = "!!fieldConfig?.isMultiple"
				:map="'API' === fieldConfig?.selectOptionType?{
					label: 'name',
					key: 'id'
				}:{
					label: 'text',
					key: 'value'
				}"
				@getOptData="getOptData"
				v-bind="$attrs"/>
		</uni-forms-item>
		<uni-forms-item
			v-if="['pageSelect',].includes(fieldConfig?.type)"
			:label="fieldConfig?.label"
			:name="fieldConfig?.name" 
			:required="!!fieldConfig?.required"
			:rules="[{ required: !!fieldConfig?.required, errorMessage: fieldConfig?.placeholder || `请选择${fieldConfig?.label}` }]">
			<snowy-sel-picker
				v-model="formData[fieldConfig?.name]"
				:placeholder="fieldConfig?.placeholder"
				:isMultiple = "false"
				:map="{
					label: 'name',
					key: 'id'
				}"
				:isPage = "true" 
				@getOptData="getOptData"
				@getSelData="getSelData"
				v-bind="$attrs"/>
		</uni-forms-item>
	</view>
</template>
<script setup>
	import request from '@/utils/request'
	import { ref, reactive } from "vue"
	import CallbackState from "@/enum/callback-state"
	const props = defineProps({
		fieldConfig: {
			type: Object,
			required: true
		},
		formData: {
			type: Object,
			required: true
		},
	})
	const options = uni.$snowy.tool.dictList(props.fieldConfig?.dictTypeCode)
	
	const getOptData = (param, callback) => {
		if('DICT' === props.fieldConfig?.selectOptionType){
			const data = uni.$snowy.tool.dictList(props.fieldConfig?.dictTypeCode)
			return callback({ state: CallbackState.SUCCESS, data: data })
		}
		if(['select',].includes(props.fieldConfig?.type) && 'API' === props.fieldConfig?.selectOptionType){
			request({
				url: props.fieldConfig?.selOptionApiUrl,
				method: 'GET',
				data: {
					current: -1
				}
			}).then(data => {
				return callback({ state: CallbackState.SUCCESS, data: data?.records })
			})
		}
		if(['pageSelect',].includes(props.fieldConfig?.type)){
			const parameter = {
				current: param.pageNo,
				size: param.pageSize
			}
			request({
				url: props.fieldConfig?.selOptionApiUrl,
				method: 'GET',
				data: parameter
			}).then(data => {
				return callback({ state: CallbackState.SUCCESS, data: data?.records })
			})
		}
	}
	
	// 根据已选择的数据查询数据
	const getSelData = (curSelDataKey, callback) => {
		if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
			request({
				url: props.fieldConfig?.selDataApiUrl,
				method: 'POST',
				data: {
					idList: [curSelDataKey]
				}
			}).then(data => {
				callback(data[0])
			})
		}
	}
</script>

<style>
</style>