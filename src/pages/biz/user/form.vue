<template>
	<view>
		<view style="margin-bottom: 80rpx;">
			<tui-tabs :top="0" :isFixed="true" :tabs="[{name:'基础信息'}, {name: '更多信息'}]" :currentTab="curView" @change="(e) => {
					if (curView != e.index) {
						curView = e.index
					}
				}"></tui-tabs>
		</view>
		<view class="snowy-form">
			<uni-forms ref="formRef" :model="formData" label-position="top" :rules="rules" validate-trigger="blur" label-width="auto" label-align="left">
				<view v-show="curView === 0">
					<uni-forms-item label="账号" name="account" required :rules="[{ required: true, errorMessage: '请输入账号' }]">
						<uni-easyinput v-model="formData.account" placeholder="请输入账号"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="姓名" name="name" required :rules="[{ required: true, errorMessage: '请输入姓名' }]">
						<uni-easyinput v-model="formData.name" placeholder="请输入姓名"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="性别" name="gender">
						<uni-data-checkbox v-model="formData.gender" :localdata="genderOptions" />
					</uni-forms-item>
					<uni-forms-item label="昵称" name="nickname">
						<uni-easyinput v-model="formData.nickname" placeholder="请输入昵称"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="手机号" name="phone">
						<uni-easyinput v-model="formData.phone" placeholder="请输入手机"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="邮箱" name="email">
						<uni-easyinput v-model="formData.email" placeholder="请输入邮箱"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="出生日期" name="birthday">
						<uni-datetime-picker type="date" return-type="string" format="YYYY-MM-DD" v-model="formData.birthday" />
					</uni-forms-item>
					<uni-forms-item label="选择组织" name="orgId" required :rules="[{ required: true, errorMessage: '请选择组织' }]">
						<snowy-tree-picker v-model="formData.orgId" placeholder="请选择组织" @getTreeOptData="selectorFunction.org.getTreeOptData" :map="{key: 'id', parentKey: 'parentId', children: 'children', label: 'name'}" @confirm="selectorFunction.org.confirm">
						</snowy-tree-picker>
					</uni-forms-item>
					<uni-forms-item label="选择职位" name="positionId" required :rules="[{ required: true, errorMessage: '请选择职位' }]">
						<snowy-sel-picker :autoLoadOptData="isLoadPositionOptData" :optDataRefresherEnabled="isLoadPositionOptData" :map="{key: 'id', label: 'name'}" v-model="formData.positionId" @getOptData="selectorFunction.position.getOptData" placeholder="请选择选择职位" :isPage="true" @getSelData="selectorFunction.position.getSelData"></snowy-sel-picker>
					</uni-forms-item>
					<uni-forms-item label="选择主管" name="directorId">
						<snowy-user-picker v-model="formData.directorId" placeholder="请选择主管" :map="{key: 'id', label: 'name'}" @getOptData="selectorFunction.user.getOptData" :isPage="true" @getSelData="selectorFunction.user.getSelData">
						</snowy-user-picker>
					</uni-forms-item>
					<uni-forms-item label="员工编号" name="empNo">
						<uni-easyinput v-model="formData.empNo" placeholder="请输入员工编号"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="职位级别" name="positionLevel">
						<uni-easyinput v-model="formData.positionLevel" placeholder="请输入职位级别"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="入职日期" name="entryDate">
						<uni-datetime-picker type="date" return-type="string" format="YYYY-MM-DD" v-model="formData.entryDate" />
					</uni-forms-item>
					<!-- required :rules="[{ required: true, errorMessage: '请添加任职信息' }]" -->
					<uni-forms-item label="任职信息" name="positionJson">
						<formPosition v-model="formData.positionJson" ref="positionJsonRef"></formPosition>
					</uni-forms-item>
				</view>
				<view v-show="curView === 1">
					<uni-forms-item label="民族" name="nation">
						<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.nation" @getOptData="selectorFunction.nationOpt" searchEnabled placeholder="请选择民族"></snowy-sel-picker>
					</uni-forms-item>
					<uni-forms-item label="籍贯" name="nativePlace">
						<uni-easyinput v-model="formData.nativePlace" placeholder="请输入籍贯"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="家庭住址" name="homeAddress">
						<uni-easyinput type="textarea" v-model="formData.homeAddress" placeholder="请输入家庭住址"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="通信地址" name="mailingAddress">
						<uni-easyinput type="textarea" v-model="formData.mailingAddress" placeholder="请输入通信地址">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="证件类型" name="idCardType">
						<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.idCardType" @getOptData="selectorFunction.idcardTypeOpt" placeholder="请选择证件类型"></snowy-sel-picker>
					</uni-forms-item>
					<uni-forms-item label="证件号码" name="idCardNumber">
						<uni-easyinput v-model="formData.idCardNumber" placeholder="请输入证件号码"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="文化程度" name="cultureLevel">
						<snowy-sel-picker :map="{key: 'value', label: 'text'}" v-model="formData.cultureLevel" @getOptData="selectorFunction.cultureLevelOpt" placeholder="请选择文化程度"></snowy-sel-picker>
					</uni-forms-item>
					<uni-forms-item label="政治面貌" name="politicalOutlook">
						<uni-easyinput v-model="formData.politicalOutlook" placeholder="请输入政治面貌"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="毕业学校" name="college">
						<uni-easyinput v-model="formData.college" placeholder="请输入毕业学校"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="学历" name="education">
						<uni-easyinput v-model="formData.education" placeholder="请输入学历"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="学制" name="eduLength">
						<uni-easyinput v-model="formData.eduLength" placeholder="请输入学制"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="学位" name="degree">
						<uni-easyinput v-model="formData.degree" placeholder="请输入学位"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="家庭电话" name="homeTel">
						<uni-easyinput v-model="formData.homeTel" placeholder="请输入家庭电话"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="办公电话" name="officeTel">
						<uni-easyinput v-model="formData.officeTel" placeholder="请输入办公电话"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="紧急联系人" name="emergencyContact">
						<uni-easyinput v-model="formData.emergencyContact" placeholder="请输入紧急联系人"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="紧急联系电话" name="emergencyPhone">
						<uni-easyinput v-model="formData.emergencyPhone" placeholder="请输入紧急联系电话"></uni-easyinput>
					</uni-forms-item>
					<uni-forms-item label="紧急联系人地址" name="emergencyAddress">
						<uni-easyinput type="textarea" v-model="formData.emergencyAddress" placeholder="请输入紧急联系人地址">
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms ref="dynamicFormRef" :model="dynamicFormData" label-position="top" label-width="auto" label-align="left">
						<snowy-dyna-field v-for="(item, index) in dynamicFieldConfigList" :key="index" :index="index" :fieldConfig="item" :formData="dynamicFormData" />
					</uni-forms>
				</view>
			</uni-forms>
			<tui-button margin="50rpx 0" :preventClick="true" :shadow="true" @click="submit">提交</tui-button>
		</view>
	</view>
</template>
<script setup>
	import config from '@/config'
	import { nextTick, reactive, ref } from "vue"
	import bizUserApi from '@/api/biz/biz-user-api'
	import userCenterApi from '@/api/sys/user-center-api'
	import formPosition from './form-position.vue'
	import { onLoad, onShow, onReady, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app"
	import CallbackState from "@/enum/callback-state"
	const curView = ref(0)
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	// 常用正则规则大全：https://any86.github.io/any-rule/
	const rules = reactive({
		phone: {
			rules: [{
					pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
					errorMessage: '请填写符合要求的11位手机号',
				},
				// {
				// 	minLength: 3,
				// 	maxLength: 5,
				// 	errorMessage: '账户长度在 {minLength} 到 {maxLength} 个字符',
				// }
			]
		},
		email: {
			rules: [{
				pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
				errorMessage: '请填写正确的邮箱号',
			}, ]
		},
	})
	// 性别
	const genderOptions = uni.$snowy.tool.dictList('GENDER')
	// 职位参数
	const isLoadPositionOptData = ref(false)
	const positionSearchData = ref({})
	// 职位
	const positionJsonRef = ref()
	// 传递用户选择器需要的API
	const selectorFunction = {
		// 组织
		org: {
			getTreeOptData: async (param, callback) => {
				const data = await bizUserApi.userOrgTreeSelector(param)
				callback({ state: CallbackState.SUCCESS, treeData: data })
			},
			confirm: ({ curSelDataKey, curSelData }) => {
				formData.value.positionId = null
				positionSearchData.value.orgId = curSelDataKey
				isLoadPositionOptData.value = true
			},
		},
		// 职位
		position: {
			getOptData: async ({ pageNo, pageSize }, callback) => {
				const parameter = { current: pageNo, size: pageSize }
				Object.assign(parameter, positionSearchData.value)
				const data = await bizUserApi.userPositionSelector(parameter)
				callback({ state: CallbackState.SUCCESS, data: data?.records })
			},
			getSelData: async (curSelDataKey, callback) => {
				if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
					const data = await userCenterApi.getPositionListByIdList({
						idList: [curSelDataKey]
					})
					callback({ state: CallbackState.SUCCESS, data: data[0] })
				}
			}
		},
		// 用户
		user: {
			getOptData: async ({ pageNo, pageSize, keyword }, callback) => {
				const parameter = { current: pageNo, size: pageSize, searchKey: keyword }
				const data = await bizUserApi.userSelector(parameter)
				callback({ state: CallbackState.SUCCESS, data: data?.records })
			},
			getSelData: async (curSelDataKey, callback) => {
				if (uni.$snowy.tool.isNotEmpty(curSelDataKey)) {
					const data = await userCenterApi.userCenterGetUserListByIdList({
						idList: [curSelDataKey]
					})
					callback({ state: CallbackState.SUCCESS, data: data[0] })
				}
			}
		},
		// 民族
		nationOpt: ({ keyword }, callback) => {
			let optData = uni.$snowy.tool.dictList('NATION')
			if (uni.$snowy.tool.isNotEmpty(keyword)) {
				optData = optData.filter(item => item.text.includes(keyword))
			}
			callback({ state: CallbackState.SUCCESS, data: optData })
		},
		// 身份证件
		idcardTypeOpt: (param, callback) => {
			callback({ state: CallbackState.SUCCESS, data: uni.$snowy.tool.dictList('IDCARD_TYPE') })
		},
		// 文化程度
		cultureLevelOpt: (param, callback) => {
			callback({ state: CallbackState.SUCCESS, data: uni.$snowy.tool.dictList('CULTURE_LEVEL') })
		},
	}
	// 动态表单
	const dynamicFormRef = ref()
	const dynamicFieldConfigList = ref([])
	const dynamicFormData = ref({})
	if (config.IS_ENTTERPRISE) {
		bizUserApi.userDynamicFieldConfigList().then(data => {
			dynamicFieldConfigList.value = data || []
		})
	}
	// 加載
	onLoad(async (option) => {
		if (!option.id) { return }
		formData.value = await bizUserApi.userDetail({ id: option.id })
		dynamicFormData.value = JSON.parse(formData.value.extJson) || {}
		if (!formData.value.orgId) { return }
		positionSearchData.value.orgId = formData.value.orgId
		isLoadPositionOptData.value = true
	})
	const submit = () => {
		// 子表单数据给父表单数据赋值，并校验子表单数据
		positionJsonRef.value.formListEmitAndValidate().then(result => {
			const promiseList = []
			promiseList.push(new Promise((resolve, reject) => {
				formRef.value.validate().then((result) => {
					resolve(result)
				}).catch((err) => {
					reject(err)
				})
			}))
			promiseList.push(new Promise((resolve, reject) => {
				dynamicFormRef.value.validate().then((result) => {
					resolve(result)
				}).catch((err) => {
					reject(err)
				})
			}))
			Promise.all(promiseList).then(async () => {
				formData.value.extJson = JSON.stringify(dynamicFormData.value)
				const data = await bizUserApi.submitForm(formData.value, !formData.value.id)
				uni.$snowy.tool.setRefresh({
					key: "formBack"
				})
				uni.navigateBack({
					delta: 1
				})
			}).catch(err => {
				console.error('父表单错误信息：', err);
			})
		}).catch(err => {
			console.error('子表单错误信息：', err);
		})
	}
</script>
<style lang="scss" scoped>
</style>