<template>
	<view class="snowy-sel-picker">
		<view @tap="tapInput" :class="{ 'input-disabled': props.disabled }">
			<view class="input-value">
				<!-- 单选 -->
				<view v-if="!isMultiple && curSelDataKey && curSelDataKey !== ''">
					{{ curSelData[map.label] }}
				</view>
				<!-- 多选 -->
				<view class="multiple" v-else-if="!!isMultiple && curSelDataKey && curSelDataKey.length > 0" v-for="(item, key, index) in curSelData" :key="index">
					{{ item[map.label] }}
				</view>
				<view class="placeholder" v-else>
					{{ placeholder }}
				</view>
			</view>
		</view>
		<uni-popup ref="popRef" type="bottom" background-color="transparent" maskBackgroundColor="rgba(0, 0, 0, 0.6)">
			<view class="snowy-shadow pop-container" v-if="popShow">
				<view class="action">
					<view class="snowy-color-grey snowy-text-bold" @click="cancel"> 取消 </view>
					<view class="snowy-color-primary snowy-text-bold" @click="confirm"> 确定 </view>
				</view>
				<!-- 已选择 -->
				<scroll-view :scroll-y="true" class="snowy-shadow choiced" :style="{ maxHeight: !isMultiple? '5vh' : '10vh' }" v-show="!!curSelDataKey && (!isMultiple? true : curSelDataKey.length > 0)">
					<!-- 单选已选择 -->
					<view class="single" v-if="!isMultiple">
						<view class="snowy-color-white" @click="delData(curSelData)">
							{{ curSelData[map.label] }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delData(curSelData)" color="#ffffff" size="12"></icon>
						</view>
					</view>
					<!-- 多选已选择 -->
					<view class="multiple" v-if="!!isMultiple" v-for="(item, index) in curSelData" :key="index">
						<view class="snowy-color-white" @click="delData(item)">
							{{ item[map.label] }}
						</view>
						<view class="icon">
							<icon type="clear" @click="delData(item)" color="#ffffff" size="12"></icon>
						</view>
					</view>
				</scroll-view>
				<!-- 搜索 -->
				<view v-if="searchEnabled">
					<slot name="search">
						<view class="snowy-item">
							<snowy-search v-model="optParam[optParamMap.keyword]" @confirm="searchConfirm" @clear="searchClear" :customStyle="{'padding': 0}">
							</snowy-search>
						</view>
					</slot>
				</view>
				<!-- 面板数据 -->
				<view class="data">
					<z-paging ref="optDataPagingRef" :fixed="false" use-virtual-list :force-close-inner-list="true" cell-height-mode="dynamic" @virtualListChange="virtualListChange" @query="queryList" :auto="autoLoadOptData" :refresher-enabled="optDataRefresherEnabled">
						<view class="snowy-shadow snowy-item snowy-padding" :id="`zp-id-${item.zp_index}`" :key="item.zp_index" v-for="(item,index) in panelData" :class="{ 'item-sel': !isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1 }" @click="selOrDelData(item, index)">
							<uni-row>
								<uni-col :span="22">
									<slot name="option" :item="item">
										<view class="snowy-text-bold snowy-text-ellipsis"> {{item[map.label]}} </view>
									</slot>
								</uni-col>
								<uni-col :span="2">
									<uni-icons v-show="!isMultiple ? item[map.key] != curSelDataKey: curSelDataKey.indexOf(item[map.key]) == -1" type="circle" :size="20"></uni-icons>
									<uni-icons v-show="!isMultiple ? item[map.key] == curSelDataKey: curSelDataKey.indexOf(item[map.key]) != -1" type="checkbox-filled" :size="20" color="#2979ff"></uni-icons>
								</uni-col>
							</uni-row>
						</view>
					</z-paging>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script setup>
	import { reactive, ref, getCurrentInstance, watch, inject, nextTick } from "vue"
	import CallbackState from "@/enum/callback-state";
	const emits = defineEmits(['update:modelValue', 'noFindKey', 'getSelData', 'getOptData', 'cancel', 'confirm', 'searchConfirm', 'searchClear'])
	const props = defineProps({
		modelValue: [String, Array, Number],
		dataType: {
			type: String,
			default: false,
			default: () => '' // ''(空字符串) "string" "array"（多选以逗号进行分割）
		},
		isMultiple: {
			type: Boolean,
			default: false,
			required: false
		},
		placeholder: {
			type: String,
			default: "请选择",
			required: false
		},
		map: {
			type: Object,
			default: () => {
				return {
					key: "key",
					label: "label"
				}
			},
			required: false
		},
		optParamMap: {
			type: Object,
			default: () => {
				return {
					pageNo: 'pageNo',
					pageSize: 'pageSize',
					keyword: 'keyword'
				}
			},
			required: false
		},
		disabled: {
			type: Boolean,
			default: false,
			required: false
		},
		// 是否开启分页模式，如果开启分页模式，
		// 那么就要实现getSelData方法，并提供相应的回调（通过服务端获取已选择的数据）
		// 与此同时要实现getOptData方法（用于分页加载）
		isPage: {
			type: Boolean,
			default: false,
			required: false
		},
		searchEnabled: {
			type: Boolean,
			default: false,
			required: false
		},
		autoLoadOptData: {
			type: Boolean,
			default: true,
			required: false
		},
		optDataRefresherEnabled: {
			type: Boolean,
			default: true,
			required: false
		}
	})
	const panelData = ref([])
	// 弹出
	const popRef = ref()
	const popShow = ref(false)
	// 当前选中的数据key及数据
	const curSelDataKey = !props.isMultiple ? ref("") : ref([])
	const curSelData = !props.isMultiple ? ref({}) : ref([])
	// 选项参数
	const optParam = ref({
		[props.optParamMap.keyword]: ''
	})
	// 修改参数，供父组件调用
	const setOptParam = (data) => {
		optParam.value = { ...optParam.value, ...data }
	}
	const optDataPagingRef = ref()
	const setSelData = () => {
		// 单选curSelData初始化值赋值
		if (!props.isMultiple) {
			if (uni.$snowy.tool.isNotEmpty(props.modelValue)) {
				if ('array' === props.dataType) {
					curSelDataKey.value = uni.$xeu.clone(props.modelValue[0], true)
				} else {
					curSelDataKey.value = uni.$xeu.clone(props.modelValue, true)
				}
			}
			// curSelDataKey.value = props.modelValue ? uni.$xeu.clone(props.modelValue, true) : ""
			curSelData.value = {}
			if (uni.$snowy.tool.isEmpty(curSelDataKey.value)) {
				return
			}
			// 单选分页
			if (!!props.isPage) {
				emits('getSelData', curSelDataKey.value, ({ state, data, msg }) => {
					// 回调错误异常处理
					if (state === CallbackState.ERROR) {
						return uni.$snowy.modal.alert(msg)
					}
					if (uni.$snowy.tool.isEmpty(data)) {
						// 单选无法找到已选中数据
						curSelData.value = {
							[props.map.key]: curSelDataKey.value,
							[props.map.label]: '该数据无权限或不存在'
						}
						emits('noFindKey', {
							[props.map.key]: curSelDataKey.value,
						}, (val) => {
							curSelData.value = val
						})
						return
					}
					return curSelData.value = data
				})
			}
			// 单选不分页
			if (!props.isPage) {
				emits('getOptData', optParam.value, ({ state, data, msg }) => {
					// 回调错误异常处理
					if (state === CallbackState.ERROR) {
						return uni.$snowy.modal.alert(msg)
					}
					const findSelData = uni.$xeu.find(data || [], item => {
						return curSelDataKey.value == item[props.map.key]
					})
					if (uni.$snowy.tool.isEmpty(findSelData)) {
						// 无法找到已选中数据
						curSelData.value = {
							[props.map.key]: curSelDataKey.value,
							[props.map.label]: '该数据无权限或不存在'
						}
						emits('noFindKey', {
							[props.map.key]: curSelDataKey.value,
						}, (val) => {
							curSelData.value = val
						})
						return
					}
					curSelData.value = findSelData
				})
			}
			return
		}
		// 多选curSelData初始化值赋值
		if (!!props.isMultiple) {
			if (uni.$snowy.tool.isNotEmpty(props.modelValue)) {
				if ('string' === props.dataType) {
					curSelDataKey.value = uni.$xeu.clone(props.modelValue.split(','), true)
				} else {
					curSelDataKey.value = uni.$xeu.clone(props.modelValue, true)
				}
			}
			// curSelDataKey.value = props.modelValue ? uni.$xeu.clone(props.modelValue, true) : []
			curSelData.value = []
			if (uni.$snowy.tool.isEmpty(curSelDataKey.value)) {
				return
			}
			// 多选分页
			if (!!props.isPage) {
				emits('getSelData', curSelDataKey.value, ({ state, data, msg }) => {
					// 回调错误异常处理
					if (state === CallbackState.ERROR) {
						return uni.$snowy.modal.alert(msg)
					}
					for (let item of curSelDataKey.value) {
						if (uni.$snowy.tool.isEmpty(data)) {
							// 无法找到已选中数据
							let notFindSelDataItem = {
								[props.map.key]: item,
								[props.map.label]: '该数据无权限或不存在'
							}
							emits('noFindKey', {
								[props.map.key]: item,
							}, (val) => {
								notFindSelDataItem = val
							})
							curSelData.value.push(notFindSelDataItem)
							continue;
						}
						const findSelDataItem = uni.$xeu.find(data || [], i => {
							return item == i[props.map.key]
						})
						if (uni.$snowy.tool.isEmpty(findSelDataItem)) {
							// 无法找到已选中数据
							let notFindSelDataItem = {
								[props.map.key]: item,
								[props.map.label]: '该数据无权限或不存在'
							}
							emits('noFindKey', {
								[props.map.key]: item,
							}, (val) => {
								notFindSelDataItem = val
							})
							curSelData.value.push(notFindSelDataItem)
							continue;
						}
						curSelData.value.push(findSelDataItem)
					}
				})
			}
			// 多选不分页
			if (!props.isPage) {
				emits('getOptData', optParam.value, ({ state, data, msg }) => {
					// 回调错误异常处理
					if (state === CallbackState.ERROR) {
						return uni.$snowy.modal.alert(msg)
					}
					for (let item of curSelDataKey.value) {
						// 返回数据为空
						if (uni.$snowy.tool.isEmpty(data)) {
							// 无法找到已选中数据
							let notFindSelDataItem = {
								[props.map.key]: item,
								[props.map.label]: '该数据无权限或不存在'
							}
							emits('noFindKey', {
								[props.map.key]: item,
							}, (val) => {
								notFindSelDataItem = val
							})
							curSelData.value.push(notFindSelDataItem)
							continue;
						}
						const findSelDataItem = uni.$xeu.find(data || [], i => {
							return item == i[props.map.key]
						})
						// 返回数据不为空，但找不到数据
						if (uni.$snowy.tool.isEmpty(findSelDataItem)) {
							// 无法找到已选中数据
							let notFindSelDataItem = {
								[props.map.key]: item,
								[props.map.label]: '该数据无权限或不存在'
							}
							emits('noFindKey', {
								[props.map.key]: item,
							}, (val) => {
								notFindSelDataItem = val
							})
							curSelData.value.push(notFindSelDataItem)
							continue;
						}
						curSelData.value.push(findSelDataItem)
					}
				})
			}
		}
	}
	setSelData()
	watch(() => props.modelValue, (newValue, oldValue) => {
		if (newValue !== oldValue) {
			setSelData()
		}
	}, {
		deep: false,
		immediate: false
	})
	// 搜索确认
	const searchConfirm = (val) => {
		emits('searchConfirm', val)
		optDataPagingRef.value.reload()
	}
	// 搜索清除
	const searchClear = () => {
		emits('searchClear')
		optDataPagingRef.value.reload()
	}
	// 点击输入框
	const tapInput = () => {
		popRef.value.open()
		popShow.value = true
	}
	// 选择或删除数据
	const selOrDelData = (item, index) => {
		if (!props.isMultiple) {
			if (item[props.map.key] != curSelDataKey.value) {
				selData(item, index)
			} else {
				delData(item, index)
			}
		} else {
			if (!curSelDataKey.value.includes(item[props.map.key])) {
				selData(item, index)
			} else {
				delData(item, index)
			}
		}
	}
	// 选择数据
	const selData = (item, index) => {
		if (!props.isMultiple) {
			curSelDataKey.value = item[props.map.key]
			curSelData.value = item
		} else {
			curSelDataKey.value.push(item[props.map.key])
			curSelData.value.push(item)
		}
	}
	// 移除数据
	const delData = (item, index) => {
		if (!props.isMultiple) {
			curSelDataKey.value = ""
			curSelData.value = {}
		} else {
			curSelDataKey.value.splice(curSelDataKey.value.findIndex(curSelDataKeyItem => curSelDataKeyItem === item[props.map.key]), 1);
			curSelData.value.splice(curSelData.value.findIndex(curSelDataItem => curSelDataItem[props.map.key] === item[props.map.key]), 1);
		}
	}
	// 取消
	const cancel = () => {
		setSelData()
		emits('cancel')
		popShow.value = false
		popRef.value.close()
	}
	const confirm = () => {
		let curSelDataKeyVal = curSelDataKey.value
		// 单选
		if (!props.isMultiple && 'array' === props.dataType) {
			curSelDataKeyVal = [curSelDataKey.value]
		}
		// 多选
		if (!!props.isMultiple && 'string' === props.dataType) {
			curSelDataKeyVal = curSelDataKey.value.join(',')
		}
		// 更新数据
		emits('update:modelValue', curSelDataKeyVal)
		// 调用父组件方法
		emits('confirm', {
			curSelDataKey: curSelDataKeyVal,
			curSelData: curSelData.value
		})
		popShow.value = false
		popRef.value.close()
	}
	const virtualListChange = (vList) => {
		panelData.value = vList;
	}
	const queryList = (pageNo, pageSize) => {
		if (!props.isPage) {
			emits('getOptData', optParam.value, ({ state, data, msg }) => {
				// 回调错误异常处理
				if (state === CallbackState.ERROR) {
					return uni.$snowy.modal.alert(msg)
				}
				optDataPagingRef.value.setLocalPaging(data)
			})
		}
		if (!!props.isPage) {
			emits('getOptData', {
				...optParam.value,
				[props.optParamMap.pageNo]: pageNo,
				[props.optParamMap.pageSize]: pageSize,
			}, ({ state, data, msg }) => {
				// 回调错误异常处理
				if (state === CallbackState.ERROR) {
					return uni.$snowy.modal.alert(msg)
				}
				optDataPagingRef.value.complete(data)
			})
		}
	}
	const reloadOptData = () => {
		optDataPagingRef.value.reload()
	}
	defineExpose({
		// 设置下拉选择参数
		setOptParam,
		// 设置已选择数据
		setSelData,
		// 重置选项数据
		reloadOptData
	})
</script>
<style lang="scss" scoped>
	@import '@/static/scss/index.scss';

	::v-deep .uni-row {
		@extend .snowy-flex-v-center;
	}

	.snowy-sel-picker {
		width: 100%;
	}

	.input-value {
		font-size: 28rpx;
		line-height: 30rpx;
		padding: 20rpx;
		border: 1rpx solid #EDEDED;
		border-radius: 5rpx;

		.multiple {
			display: inline-block;
			margin: 3rpx 10rpx 3rpx 0
		}

		.placeholder {
			color: #909399;
		}
	}

	.input-disabled {
		pointer-events: none;
		background-color: rgb(247, 246, 246);
		color: rgb(192, 192, 192);
	}

	.pop-container {
		margin: 5rpx;
		padding: 10rpx;
		// background-color: #f7f7f7;
	}

	.action {
		display: flex;
		justify-content: space-between;
		margin: 30rpx;
	}

	.choiced {
		background: #5677fc;
		margin: 20rpx 0;
		padding: 10rpx 0;

		.single {
			margin: 5rpx 30rpx;
			display: inline-flex;
		}

		.multiple {
			margin: 10rpx 0 10rpx 30rpx;
			display: inline-flex;
		}

		.icon {
			display: flex;
			align-items: center;
			margin-left: 5rpx;
		}
	}

	.data {
		height: 50vh;
		background-color: #f7f7f7;
		padding-top: 10rpx;

		.item-sel {
			box-shadow: 1rpx 2rpx 2rpx $snowy-primary;
		}
	}
</style>