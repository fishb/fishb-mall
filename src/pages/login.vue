<template>
	<view class="snowy-page">
		<view class="snowy-flex-vh-center logo-content" @tap="logoTap">
			<image class="logo" :alt="sysBaseConfig.SNOWY_SYS_NAME" :src="sysBaseConfig.SNOWY_SYS_LOGO" mode="scaleToFill">
			</image>
			<text class="title">{{sysBaseConfig.SNOWY_SYS_NAME}} {{sysBaseConfig.SNOWY_SYS_VERSION}}</text>
		</view>
		<view class="login-form">
			<view class="snowy-shadow snowy-flex-v-center input-item" v-if="curEnv.loginSwitchTenant && tenanData.length > 0">
				<uni-icons class="icon" type="home-filled" size="20" color="#5677fc"></uni-icons>
				<picker class="input" :value="curTenanIndex" :range="tenanData" range-key="name" @change="tenanChange">
					<view class="uni-input">{{tenanData[curTenanIndex].name}}</view>
				</picker>
			</view>
			<view class="snowy-shadow snowy-flex-v-center input-item">
				<uni-icons class="icon" type="person-filled" size="20" color="#5677fc"></uni-icons>
				<input v-model="loginForm.account" class="input" type="text" placeholder="请输入账号" maxlength="30" />
			</view>
			<view class="snowy-shadow snowy-flex-v-center input-item">
				<uni-icons class="icon" type="locked-filled" size="20" color="#5677fc"></uni-icons>
				<input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" maxlength="20" />
			</view>
			<view class="snowy-shadow snowy-flex-v-center input-item" v-if="sysBaseConfig.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === 'true'">
				<uni-icons class="icon" type="map-filled" size="20" color="#5677fc"></uni-icons>
				<input v-model="loginForm.validCode" type="text" class="input" placeholder="请输入验证码" maxlength="4" />
				<image :src="validCodeBase64" @click="loginCaptcha" class="login-code-img" mode="scaleToFill"></image>
			</view>
			<view>
				<tui-button margin="70rpx 0" :preventClick="true" :shadow="true" @click="handleLogin">登录</tui-button>
			</view>
		</view>
	</view>
</template>
<script setup>
	import { ref, reactive, getCurrentInstance, computed } from 'vue'
	import loginApi from '@/api/auth/login-api'
	import tenApi from '@/api/ten/ten-api'
	import store from '@/store'
	import config from '@/config'
	const { proxy } = getCurrentInstance()
	// 当前租户index
	const curTenanIndex = ref(0)
	// 所有租户
	const tenanData = ref([])
	// 验证码
	const validCodeBase64 = ref("")
	// 登录表单
	const loginForm = reactive({
		account: 'superAdmin',
		password: '123456',
		validCode: '',
		validCodeReqNo: '',
	})
	store.dispatch('GetSysBaseConfig')
	// 系统配置
	const sysBaseConfig = computed(() => {
		return store.getters.sysBaseConfig
	})
	// 当前环境
	const curEnv = computed(() => {
		return store.getters.curEnv
	})
	// 点击logo
	const logoTap = () => {
		if (!config.ENABLE_CONFIG_PAGE) { return }
		uni.$snowy.tab.reLaunch('/pages/config/index')
	}
	// 获取租户
	const getTenSelector = async () => {
		if (!curEnv.value?.loginSwitchTenant) {
			return
		}
		const data = await tenApi.tenSelector()
		tenanData.value = [{
			name: '主租户',
			domain: curEnv.value.mainTenantDomain
		}].concat(data)
		const indexOfRes = uni.$xeu.findIndexOf(tenanData.value, item => item.domain === store.getters.tenantDomain)
		if (indexOfRes) {
			curTenanIndex.value = indexOfRes
		}
	}
	if(config.IS_ENTTERPRISE){
		getTenSelector()
	}
	// 租户切换
	const tenanChange = (e) => {
		curTenanIndex.value = e.detail.value;
		store.commit('SET_tenantDomain', tenanData.value[curTenanIndex.value]?.domain)
		// 切换租户后重新获取配置文件和验证码
		store.dispatch('GetSysBaseConfig')
		if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
			loginCaptcha()
		}
	}
	// 获取图形验证码
	const loginCaptcha = async () => {
		const data = await loginApi.getPicCaptcha()
		validCodeBase64.value = data?.validCodeBase64
		loginForm.validCodeReqNo = data?.validCodeReqNo
	}
	if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
		loginCaptcha()
	}
	// 登录方法
	const handleLogin = () => {
		if (loginForm.account === "") {
			uni.$snowy.modal.msgError("请输入账号")
		} else if (loginForm.password === "") {
			uni.$snowy.modal.msgError("请输入密码")
		} else if (loginForm.validCode === "" && sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN === 'true') {
			uni.$snowy.modal.msgError("请输入验证码")
		} else {
			pwdLogin()
		}
	}
	// 密码登录
	const pwdLogin = () => {
		store.dispatch('Login', loginForm).then(() => {
			// 所有异步请求结束之后才能够进行下一步操作
			Promise.all([
				store.dispatch('GetUserLoginMenu'),
				store.dispatch('GetUserInfo'),
				store.dispatch('GetDictTypeTreeData'),
			]).then((result) => {
				// #ifdef H5
				const { searchQuery, hashQuery } = uni.$xeu.parseUrl(location.href)
				if (searchQuery.redirect) {
					uni.$snowy.tab.reLaunch(searchQuery.redirect)
				} else if (hashQuery.redirect) {
					uni.$snowy.tab.reLaunch(hashQuery.redirect)
				} else {
					// #endif
					uni.$snowy.tab.reLaunch('/pages/home/index')
					// #ifdef H5
				}
				// #endif
			}).catch(err => {
				if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
					loginCaptcha()
					loginForm.validCode = ""
				}
			})
		}).catch(err => {
			if (sysBaseConfig.value.SNOWY_SYS_DEFAULT_CAPTCHA_OPEN) {
				loginCaptcha()
				loginForm.validCode = ""
			}
		})
	}
</script>
<style lang="scss" scoped>
	page {
		background-color: #ffffff;
	}

	.logo-content {
		margin: 15% auto;

		.logo {
			width: 100rpx;
			height: 100rpx;
		}

		.title {
			font-size: 40rpx;
			margin-left: 15rpx;
		}
	}

	.login-form {
		margin: 60rpx auto;
		width: 80%;

		.input-item {
			margin: 35rpx auto;
			background-color: #f5f6f7;
			height: 90rpx;

			.icon {
				margin-left: 20rpx;
			}

			.input {
				width: 100%;
				font-size: 30rpx;
				padding-left: 25rpx;
			}

			.login-code-img {
				cursor: pointer;
				width: 70%;
				height: 85rpx
			}
		}
	}
</style>