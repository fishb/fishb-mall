<template>
	<view>
		<uni-section :title="`日程`" type="square"></uni-section>
		<uni-calendar :insert="true" :lunar="true" @change="change" :showMonth="false" />
		<view class="snowy-color-primary add-schedule" @tap="add"> 新增 </view>
		<uni-list :border="false">
			<uni-list-item :show-extra-icon="true" :extra-icon="{
					color: '#2979ff',
					size: '20',
					type: 'notification-filled'
				}" :title="schedule.scheduleContent" :key="schedule.id" v-for="schedule in scheduleList">
				<template v-slot:footer>
					<view style="align-items: center;">
						{{schedule.scheduleTime}}
						<uni-icons @click="del(schedule)" type="trash-filled" color="#e43d33" size="20"></uni-icons>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<add-pop ref="addPopRef" @ok="seleScheduleList()"></add-pop>
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, computed } from "vue"
	import indexApi from '@/api/sys/index-api'
	import AddPop from './add-pop.vue'
	const scheduleList = ref([])
	const scheduleDate = ref(uni.$xeu.toDateString(new Date(), 'yyyy-MM-dd'))
	const addPopRef = ref()
	const seleScheduleList = async () => {
		const data = await indexApi.indexScheduleList({
			scheduleDate: scheduleDate.value
		})
		scheduleList.value = data
	}
	seleScheduleList()
	const change = (e) => {
		scheduleDate.value = e.fulldate
		seleScheduleList()
	}
	const add = () => {
		addPopRef.value.onOpen(scheduleDate)
	}
	const del = async (schedule) => {
		const params = [{
			id: schedule.id
		}]
		await indexApi.indexScheduleDeleteSchedule(params)
		seleScheduleList()
	}
</script>
<style lang="scss" scoped>
	.add-schedule {
		cursor: pointer;
		margin: 25rpx;
		text-align: right;
		font-size: 30rpx;
	}
</style>