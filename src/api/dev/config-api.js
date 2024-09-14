import request from '@/utils/request'

export default {
	configSysBaseList() {
		return request({
			url: '/dev/config/sysBaseList',
			method: 'GET',
			isToken: false
		})
	}
}