import store from '@/store'
import { getToken } from '@/utils/auth'
import { errorCodeMap, reloadCodes } from '@/utils/errorCode'
import sysConfig from '@/config'
import { prefixUrl } from "@/utils/api-adaptive"
import { ref } from 'vue'
// #ifdef H5
import { pathAddRedirectUrl } from '@/utils/common'
import { getH5RouteByUrl } from '@/utils/common'
// #endif
const { TIMEOUT, TOKEN_NAME, TOKEN_PREFIX, NO_TOKEN_BACK_URL } = sysConfig
const requestCount = ref(0)
const request = config => {
	// 是否需要设置 token
	config.header = config.header || {}
	if (getToken() && !(config?.isToken === false)) {
		config.header[TOKEN_NAME] = TOKEN_PREFIX + getToken()
	}
	return new Promise((resolve, reject) => {
		requestCount.value++
		uni.$snowy.modal.loading('努力加载中')
		uni.request({
			method: config.method || 'GET',
			timeout: config.timeout || TIMEOUT,
			url: `${config.baseUrl || store.getters.allEnv[store.getters.envKey].baseUrl}${prefixUrl(config.url)}`,
			data: config.data,
			header: {
				domain : store.getters.tenantDomain,
				...config.header
			},
			dataType: config.dataType || 'json'
		}).then(response => {			
			const code = response.data?.code || response.statusCode || 200
			const msg = response.data?.msg || errorCodeMap[code] || errorCodeMap['default']
			if (reloadCodes.includes(code)) {
				uni.$snowy.modal.confirm(msg || '登录状态已过期，您可以清除缓存，重新进行登录?').then(() => {
					store.commit('CLEAR_cache')
					// #ifdef H5
					uni.$snowy.tab.reLaunch(pathAddRedirectUrl(NO_TOKEN_BACK_URL, getH5RouteByUrl()))
					// #endif
					// #ifndef H5
					uni.$snowy.tab.reLaunch(NO_TOKEN_BACK_URL)
					// #endif
				})
				reject('无效的会话，或者会话已过期，请重新登录。')
			} else if (code !== 200) {
				uni.$snowy.modal.alert(msg)
				reject(code)
			}
			// 是否返回服务端原数据
			if (config.isReturnOriginalData) {
				resolve(response?.data)
			} else {
				resolve(response?.data?.data)
			}
		}).catch(error => {
			let { errMsg } = error
			if (errMsg === 'Network Error') {
				errMsg = '后端接口连接异常'
			} else if (errMsg.includes('timeout')) {
				errMsg = '系统接口请求超时'
			} else if (errMsg.includes('Request failed with status code')) {
				errMsg = '系统接口' + errMsg.substr(errMsg.length - 3) + '异常'
			} else if (errMsg.includes('request:fail')) {
				errMsg = '请求失败'
			}
			uni.$snowy.modal.alert(errMsg)
			reject(error)
		}).finally(() => {
			requestCount.value--
			if(requestCount.value === 0){
				uni.$snowy.modal.closeLoading()
			}
		})
	})
}
export default request
