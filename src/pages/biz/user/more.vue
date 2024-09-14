<template>
	<uni-popup ref="popRef" type="bottom" background-color="transparent" maskBackgroundColor="rgba(0, 0, 0, 0.6)">
		<tui-list-view unlined="all" background-color="transparent">
			<tui-list-cell v-if="$snowy.hasPerm('mobileBizUserEdit')" :hover="true" :arrow="false" @click="edit" :radius="10" >
				<view class="snowy-text-center"> 编辑 </view>
			</tui-list-cell>
			<tui-list-cell v-if="$snowy.hasPerm('mobileBizUserDelete')" :hover="true" :arrow="false" @click="del" :radius="10" :margin-top="2">
				<view class="snowy-text-center"> 刪除 </view>
			</tui-list-cell>
			<tui-list-cell :hover="true" :arrow="false" @click="cancel" :margin-top="10" :radius="10">
				<view class="snowy-text-center"> 取消 </view>
			</tui-list-cell>
		</tui-list-view>
	</uni-popup>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance } from "vue";
	import bizUserApi from '@/api/biz/biz-user-api'
	const emits = defineEmits(['handleOk'])
	const popRef = ref()
	const record = ref({})
	const open = (data) => {
		record.value = data
		popRef.value.open()
	}
	// 编辑
	const edit = () => {
		uni.navigateTo({
			url: '/pages/biz/user/form?id=' + record.value.id
		})
		popRef.value.close()
	}
	// 删除
	const del = () => {
		uni.$snowy.modal.confirm(`是否确认删除【${ record.value.name }】用户？`).then(() => {
			bizUserApi.userDelete([{
				id: record.value.id
			}]).then(data => {
				emits('handleOk')
				popRef.value.close()
			})
		})
	}
	// 取消
	const cancel = () => {
		popRef.value.close()
	}
	defineExpose({
		open
	})
</script>
<style lang="scss">
</style>