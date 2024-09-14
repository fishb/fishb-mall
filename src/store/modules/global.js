import config from '@/config'
import storage from '@/utils/storage'
import constant from '@/utils/constant'
import smCrypto from '@/utils/smCrypto'
import loginApi from '@/api/auth/login-api'
import userCenterApi from '@/api/sys/user-center-api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import configApi from '@/api/dev/config-api'
import dictApi from '@/api/dev/dict-api'
import env from '@/env'
export default {
	state: {
		// 环境key
		envKey: storage.get(constant.envKey) || env.DEFAULT_ENV_KEY,
		// 所有环境
		allEnv: storage.get(constant.allEnv) || env.DEFAULT_ALL_ENV,
		// 当前租户域
		tenantDomain: storage.get(constant.tenantDomain) || env.DEFAULT_ALL_ENV[env.DEFAULT_ENV_KEY].tenantDomain,
		// token信息
		token: getToken(),
		// 首页配置
		homeConfigs: storage.get(constant.homeConfigs) || config.HOME_CONFIGS,
		// 用户移动端菜单（用户菜单处理后的结果）
		userMobileMenus: storage.get(constant.userMobileMenus),
		// 用户信息
		userInfo: storage.get(constant.userInfo),
		// 系统配置
		sysBaseConfig: storage.get(constant.sysBaseConfig) || config.SYS_BASE_CONFIG,
		// 字典数据
		dictTypeTreeData: storage.get(constant.dictTypeTreeData),
		// 刷新KEY
		refreshKey: storage.get(constant.refreshKey) || 'page',
		// 刷新标记
		refreshFlag: storage.get(constant.refreshFlag) || false,
		// 刷新参数
		refreshParam: storage.get(constant.refreshParam) || null
	},
	mutations: {
		SET_envKey: (state, envKey) => {
			state.envKey = envKey
			storage.set(constant.envKey, envKey)
		},
		SET_allEnv: (state, allEnv) => {
			state.allEnv = allEnv
			storage.set(constant.allEnv, allEnv)
		},
		SET_tenantDomain: (state, tenantDomain) => {
			state.tenantDomain = tenantDomain
			storage.set(constant.tenantDomain, tenantDomain)
		},
		SET_token: (state, token) => {
			state.token = token
			setToken(token)
		},
		SET_homeConfigs: (state, homeConfigs) => {
			state.homeConfigs = homeConfigs
			storage.set(constant.homeConfigs, homeConfigs)
		},
		SET_userMobileMenus: (state, userMobileMenus) => {
			state.userMobileMenus = userMobileMenus
			storage.set(constant.userMobileMenus, userMobileMenus)
		},
		SET_userInfo: (state, userInfo) => {
			state.userInfo = userInfo
			storage.set(constant.userInfo, userInfo)
		},
		SET_sysBaseConfig: (state, sysBaseConfig) => {
			state.sysBaseConfig = sysBaseConfig
			storage.set(constant.sysBaseConfig, sysBaseConfig)
		},
		SET_dictTypeTreeData: (state, dictTypeTreeData) => {
			state.dictTypeTreeData = dictTypeTreeData
			storage.set(constant.dictTypeTreeData, dictTypeTreeData)
		},
		SET_refreshKey: (state, refreshKey) => {
			state.refreshKey = refreshKey
			storage.set(constant.refreshKey, refreshKey)
		},
		SET_refreshFlag: (state, refreshFlag) => {
			state.refreshFlag = refreshFlag
			storage.set(constant.refreshFlag, refreshFlag)
		},
		SET_refreshParam: (state, refreshParam) => {
			state.refreshParam = refreshParam
			storage.set(constant.refreshParam, refreshParam)
		},
		// 清除缓存
		CLEAR_cache: (state) => {
			// 租户域清理
			// state.tenantDomain = ''
			// storage.remove(constant.tenantDomain)
			// token
			state.token = ''
			removeToken()
			// 移动端用户菜单
			state.userMobileMenus = {}
			storage.remove(constant.userMobileMenus)
			// 用户信息
			state.userInfo = {}
			storage.remove(constant.userInfo)
			// 字典信息
			state.dictTypeTreeData = {}
			storage.remove(constant.dictTypeTreeData)
			// 刷新标识
			state.refreshKey = null
			storage.remove(constant.refreshKey)
			// 刷新标识
			state.refreshFlag = false
			storage.remove(constant.refreshFlag)
			// 刷新参数
			state.refreshParam = null
			storage.remove(constant.refreshParam)
			// 配置信息
			// state.sysBaseConfig = {}
			// storage.remove(constant.sysBaseConfig)
			// storage.clean()
		},
	},
	actions: {
		// 登录获取token
		Login({
			commit,
			state
		}, userInfo) {
			const paramData = {
				account: userInfo.account.trim(),
				// 密码进行SM2加密，传输过程中看到的只有密文，后端存储使用hash
				password: smCrypto.doSm2Encrypt(userInfo.password),
				validCode: userInfo.validCode,
				validCodeReqNo: userInfo.validCodeReqNo
			}
			return new Promise((resolve, reject) => {
				loginApi.login(paramData).then(data => {
					// 缓存token
					commit('SET_token', data)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取用户信息
		GetUserInfo({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				loginApi.getLoginUser().then(data => {
					// 缓存用户信息
					commit('SET_userInfo', data)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取登錄用戶菜單
		GetUserLoginMenu({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				userCenterApi.userLoginMobileMenu().then(data => {
					// 缓存移动端用户菜单
					commit('SET_userMobileMenus', data)
					resolve(data)
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取数据字典
		GetDictTypeTreeData({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				dictApi.dictTree().then((data) => {
					if (data) {
						// 缓存字典
						commit('SET_dictTypeTreeData', data)
						resolve(data)
					}
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 获取系统基础配置
		GetSysBaseConfig({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				let sysBaseConfig = {}
				configApi.configSysBaseList().then((data) => {
					if (data) {
						data.forEach((item) => {
							sysBaseConfig[item.configKey] = item.configValue
						})
						// 缓存配置
						commit('SET_sysBaseConfig', sysBaseConfig)
					}
					resolve(sysBaseConfig)
				})
			}).catch(error => {
				reject(error)
			})
		},
		// 退出系统
		LogOut({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				loginApi.logout().then(() => {
					// 将当前租户重置至主租户中
					// commit('SET_tenantDomain', state.allEnv[state.envKey].tenantDomain)
					// 清除缓存
					commit('CLEAR_cache')
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		}
	}
}