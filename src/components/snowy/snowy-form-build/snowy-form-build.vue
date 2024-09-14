<template>
	<uni-forms ref="dyFormRef" :model="formData" label-position="top" labelWidth="auto" validate-trigger="submit">
		<snowy-form-item 
			v-for="(fieldConfig, fieldConfigIndex) in fieldConfigs"
			:ref="`form-item-ref-${fieldConfigIndex}`"
			:key="`form-item-key-${fieldConfigIndex}`"
			:fieldConfig="fieldConfig"
			:formData="formData"
			:useDefault="useDefault" />
	</uni-forms>
</template>
<script setup>
	import { nextTick, reactive, ref, watch, getCurrentInstance } from "vue"
	const emits = defineEmits(['update:formData'])
	const { proxy } = getCurrentInstance()
	const props = defineProps({
		formData: {
			type: Object,
			default: {},
			required: false
		},
		fieldConfigs: {
			type: Array,
			default: [],
			required: true
		},
		useDefault: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	// 动态表单ref
	const dyFormRef = ref()
	// 表单的规则
	const localFormRules = ref({})
	// 表单数据
	const localFormData = ref({})
	// 双向数据绑定
	watch(() => props.formData, () => {
		localFormData.value = props.formData || {}
	}, {
		deep: true,
		immediate: false
	})
	watch(() => localFormData, () => {
		emits('update:formData', localFormData.value)
	}, {
		deep: true,
		immediate: false
	})
	// 表单数据提取
	const formListEmitAndValidate = () => {
		const promiseList = []
		props.fieldConfigs.forEach((item, index) => {
			if (item.type === 'batch') {
				promiseList.push(new Promise((resolve, reject) => {
					// 验证多个batch字段
					proxy.$refs[`form-item-ref-${ index }`][0].formListValidate().then(result => {
						resolve(result)
					}).catch(err => {
						reject(err)
					})
				}))
			}
		})
		return new Promise((resolve, reject) => {
			Promise.all(promiseList).then((result) => {
				dyFormRef.value.validate().then(res => {
					resolve(props.formData)
				})
			}).catch(err => {
				reject(err)
			})
		})
	}
	defineExpose({
		formListEmitAndValidate
	})
</script>
<style lang="scss">
</style>