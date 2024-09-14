import request from '@/utils/request'
export default {
	// B端账号密码登录
	login(data) {
		return request({
			url: '/auth/b/doLogin',
			method: 'POST',
			data: data,
			isToken: false
		})
	},
	// 获取用户信息
	getLoginUser() {
		return request({
			url: '/auth/b/getLoginUser',
			method: 'GET'
		})
	},
	// 退出方法
	logout() {
		return request({
			url: '/auth/b/doLogout',
			method: 'GET'
		})
	},
	// 获取验证码
	getPicCaptcha() {
		return request({
			url: '/auth/b/getPicCaptcha',
			method: 'GET',
			isToken: false
		})
	}
}