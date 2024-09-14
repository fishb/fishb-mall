<template>
	<view>
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['input','textarea','number',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<uni-easyinput
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				:type="fieldConfig.type"
				v-model="formData[fieldConfig.name]"
				:placeholder="fieldConfig.options.placeholder" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['radio','checkbox',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<uni-data-checkbox
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				v-model="formData[fieldConfig.name]"
				:multiple="fieldConfig.options.isMultiple"
				:map="fieldConfig.options.map"
				:localdata="fieldConfig.options.options" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['select',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<snowy-sel-picker
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				v-model="formData[fieldConfig.name]"
				:isMultiple = "fieldConfig.options.isMultiple"
				:map="fieldConfig.options.map"
				@getOptData="(param, callback) => callback({ state: CallbackState.SUCCESS, data: fieldConfig.options.options })" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['date'].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<uni-datetime-picker
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				v-model="formData[fieldConfig.name]"
				:type="getDatetimePickerType(fieldConfig.options.range, fieldConfig.options.showTime)"
				:placeholder="fieldConfig.options.placeholder"
				:start-placeholder="fieldConfig.options.rangePlaceholder?fieldConfig.options.rangePlaceholder[0]:null"
				:end-placeholder="fieldConfig.options.rangePlaceholder?fieldConfig.options.rangePlaceholder[1]:null"
				 return-type="string"
				:clear-icon="fieldConfig.options.clearable">
			</uni-datetime-picker>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['time',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<view style="flex: 1;">
				<!-- start="09:01" end="21:01" -->
				<picker 
					:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false" 
					mode="time"
					:value="formData[fieldConfig.name]" 
					@change="(e)=>{formData[fieldConfig.name] = e.detail.value}">
					<view class="uni-input input-value-border">{{formData[fieldConfig.name]?formData[fieldConfig.name]:fieldConfig.options.placeholder}}</view>
				</picker>
			</view>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['rate',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<uni-rate
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				v-model="formData[fieldConfig.name]"/>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['slider',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<slider
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				:min="fieldConfig.options.min"
				:max="fieldConfig.options.max"
				:value="formData[fieldConfig.name]"
				:step="fieldConfig.options.step"
				@change="(e)=>{formData[fieldConfig.name] = e.detail.value}"
				show-value/>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['switch',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<switch
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				:checked = "formData[fieldConfig.name]"
				@change="(e)=>{formData[fieldConfig.name] = e.detail.value}" />
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['uploadFile',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<snowy-file-picker-api 
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false" 
				idDataType="objArr"
				v-model="formData[fieldConfig.name]">
			</snowy-file-picker-api>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['userSelector',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<snowy-user-picker
				:disabled="typeof(fieldConfigDisable) === 'boolean' ? fieldConfigDisable : typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false"
				v-model="formData[fieldConfig.name]"
				:isMultiple = "fieldConfig.options.isMultiple"
				:placeholder="fieldConfig.options.placeholder"
				:map="{key: 'id', label: 'name'}"
				@getOptData="selectorFunction.user.getOptData"
				:isPage="true"
				@getSelData="selectorFunction.user.getSelData">
			</snowy-user-picker>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['editor',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			:rules="fieldConfig.rules">
			<editor 
				:placeholder="fieldConfig.options.placeholder"></editor>
		</uni-forms-item>
		
		<uni-forms-item
			v-if="fieldConfig && fieldConfig.type && ['batch',].includes(fieldConfig.type) && (typeof(fieldConfig.options.hidden) === 'boolean' ? !fieldConfig.options.hidden : true)"
			:label="fieldConfig.label"
			:name="fieldConfig.name" 
			:required="fieldConfig.required" 
			>
			
			<view v-for="(item, index) in formData[fieldConfig.name]" :key="`v-${ index }`" :index="`v-${ index }`">
				<button class="uni-btn" type="warn" :plain="true" v-if ="typeof(fieldConfig.options.disabled) === 'boolean' ? !fieldConfig.options.disabled : true" @click="()=>{formData[fieldConfig.name].splice(index, 1);}">
					删除{{ fieldConfig.label }}
				</button>
				<uni-forms :ref="`batch-form-ref-${ fieldConfig.name }-${ index }`" :model="item" label-position="top" labelWidth="auto" validate-trigger="submit">
					<!-- #ifndef MP-WEIXIN -->
					<snowy-form-item v-for="(fItem, fIndex) in fieldConfig.list" :key="`sfi-${ fIndex }`" :index="`sfi-${ fIndex }`" :fieldConfig="fItem" :formData="item" :fieldConfigDisable="typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false" :useDefault="useDefault"/>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<!-- 适配小程序 -->
					<batch-form-item v-for="(fItem, fIndex) in fieldConfig.list" :key="`sfi-${ fIndex }`" :index="`sfi-${ fIndex }`" :batchfieldConfig="fItem" :batchFormData="item" :fieldConfigDisable="typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false" :useDefault="useDefault"></batch-form-item>
					<!-- #endif -->	
				</uni-forms>
			</view>
			<button class="uni-btn" type="primary" :disabled ="typeof(fieldConfig.options.disabled) === 'boolean' ? fieldConfig.options.disabled : false" @click="()=>{
				if(!formData[fieldConfig.name]){
					formData[fieldConfig.name] = []
				}
				formData[fieldConfig.name].push({})
				// formData[fieldConfig.name].unshift({})
			}">
				增加{{ fieldConfig.label }}
			</button>
		</uni-forms-item>
	</view>
</template>
<script>
	export default {
		name: 'SnowyFormItem'
	}
</script>
<script setup>
	import BatchFormItem from './batch-form-item.vue'
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	import processApi from '@/api/flw/process-api'
	import userCenterApi from '@/api/sys/user-center-api'
	import CallbackState from "@/enum/callback-state"
	
	const { proxy } = getCurrentInstance()
	const props = defineProps({
		fieldConfig: {
			type: Object,
			required: true
		},
		fieldConfigDisable:{
			type: Boolean,
			default: null,
			required:false
		},
		formData: {
			type: Object,
			required: true
		},
		useDefault: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	
	
	if(props.useDefault){
		// 默认值处理
		if(['input','textarea','number',].includes(props.fieldConfig.type)){
			props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
		}else if(['radio','checkbox',].includes(props.fieldConfig.type)){
			props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
		}else if(['select',].includes(props.fieldConfig.type)){
			if(props.fieldConfig.options.isMultiple){
				props.formData[props.fieldConfig.name] = [props.fieldConfig.options.defaultValue]
			}else{
				props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
			}
		}else if(['date',].includes(props.fieldConfig.type)){
			if(props.fieldConfig.options.range){
				props.formData[props.fieldConfig.name] = props.fieldConfig.options.rangeDefaultValue
			}else{
				props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
			}
		}else if(['time',].includes(props.fieldConfig.type)){
			props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
		}else if(['rate',].includes(props.fieldConfig.type)){
			props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
		}else if(['slider',].includes(props.fieldConfig.type)){
			props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
		}else if(['switch',].includes(props.fieldConfig.type)){
			props.formData[props.fieldConfig.name] = props.fieldConfig.options.defaultValue
		}
	}
	
	
	// 获取日期时间字段的类型
	const getDatetimePickerType = (range, showTime) => {
		if(range){
			if(showTime){
				return 'datetimerange'
			}else{
				return 'daterange'
			}
		}else{
			if(showTime){
				return 'datetime'
			}else{
				return 'date'
			}
		}
	}
	
	// 传递用户选择器需要的API
	const selectorFunction = {
		// 用户
		user: {
			getOptData: async ({ pageNo, pageSize, keyword }, callback) => {
				const parameter = { current: pageNo, size: pageSize, searchKey: keyword }
				const data = await processApi.processUserSelector(parameter)
				callback({ state: CallbackState.SUCCESS, data: data?.records })
			},
			getSelData: async (curSelDataKey, callback) => {
				if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
					if(!props.fieldConfig.options.isMultiple){
						const data = await userCenterApi.userCenterGetUserListByIdList({
							idList: [curSelDataKey]
						})
						callback({ state: CallbackState.SUCCESS, data: data[0] })
						return
					}
					if(!!props.fieldConfig.options.isMultiple){
						const data = await userCenterApi.userCenterGetUserListByIdList({
							idList: curSelDataKey
						})
						callback({ state: CallbackState.SUCCESS, data: data })
						return
					}
					
				}
			}
		},
	}
	
	// 表单校验
	const formListValidate = () => {
		if(props.fieldConfig.type === 'batch'){
			const promiseList = []
			if(props.formData[props.fieldConfig.name]){
				props.formData[props.fieldConfig.name].forEach((item, index)=>{
					promiseList.push(new Promise((resolve, reject) => {
						proxy.$refs[`batch-form-ref-${ props.fieldConfig.name }-${ index }`][0].validate().then(result => {
							resolve(result)
						}).catch(err => {
							reject(err)
						})
					}))
				})
			}
			return new Promise((resolve, reject) => {
				Promise.all(promiseList).then((result) => {
					resolve(result)
				}).catch(err=>{
					reject(err)
				})
			})
		}
	}
	defineExpose({
		formListValidate
	})
</script>

<style lang="scss">
	.uni-input {
		height: 50rpx;
		padding: 15rpx 25rpx;
		line-height:50rpx;
		font-size:28rpx;
		background:#FFF;
		flex: 1;
	}
	.input-value-border {
		border: 1px solid $uni-border-2;
		border-radius: 5upx;
	}
</style>
