const defaultEnvKey = 'local'
const defaultAllEnv = {
	local: {
		name: "本地环境",
		// 服务端baseUrl
		baseUrl: "http://192.168.0.104:82",
		// 主租户域（企业版多租户使用：注意与后端snowy.config.common.front-url进行对应）
		mainTenantDomain: "http://localhost:81",
		// 默认当前租户域（可以是子租户域也可以是主租户域）
		tenantDomain: "http://localhost:81",
		// 登录切换租户域
		loginSwitchTenant: false
	},
	pro: {
		name: "生产环境",
		// 服务端baseUrl
		baseUrl: "https://snowyapi.xiaonuo.vip",
		// 主租户域（企业版多租户使用：注意与后端snowy.config.common.front-url进行对应）
		mainTenantDomain: "https://snowy.xiaonuo.vip",
		// 默认当前租户域（可以是子租户域也可以是主租户域）
		tenantDomain: "https://lanzhou.xiaonuo.vip",
		// 登录切换租户域
		loginSwitchTenant: false
	},
}
// 应用全局配置
export default {
	DEFAULT_ENV_KEY: defaultEnvKey,
	DEFAULT_ALL_ENV: defaultAllEnv
}