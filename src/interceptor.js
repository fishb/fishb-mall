import { checkPermission } from '@/utils/auth'
// 页面跳转验证拦截器
let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"]
list.forEach(item => {
	uni.addInterceptor(item, {
		invoke(args) {
			return checkPermission(args.url.split('?')[0])
		},
		fail(err) {
			console.log(err)
		}
	})
})
