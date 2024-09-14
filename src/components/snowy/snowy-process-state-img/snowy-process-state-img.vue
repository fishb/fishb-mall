<template>
	<image v-if="props.stateCode === 'ACTIVE'" :src="$store.getters.allEnv[$store.getters.envKey].baseUrl + prefixUrl('/mobile/') + 'flw/ACTIVE.png'" class="state-img" mode="aspectFill" />
	<image v-if="props.stateCode === 'SUSPENDED'" :src="$store.getters.allEnv[$store.getters.envKey].baseUrl + prefixUrl('/mobile/') +'flw/SUSPENDED.png'" class="state-img" mode="aspectFill" />
	<image v-if="props.stateCode === 'COMPLETED'" :src="$store.getters.allEnv[$store.getters.envKey].baseUrl + prefixUrl('/mobile/') +'flw/COMPLETED.png'" class="state-img" mode="aspectFill" />
	<image v-if="props.stateCode === 'END'" :src="$store.getters.allEnv[$store.getters.envKey].baseUrl + prefixUrl('/mobile/') +'flw/END.png'" class="state-img" mode="aspectFill" />
	<image v-if="props.stateCode === 'REVOKE'" :src="$store.getters.allEnv[$store.getters.envKey].baseUrl + prefixUrl('/mobile/') +'flw/REVOKE.png'" class="state-img" mode="aspectFill" />
	<image v-if="props.stateCode === 'REJECT'" :src="$store.getters.allEnv[$store.getters.envKey].baseUrl + prefixUrl('/mobile/') +'flw/REJECT.png'" class="state-img" mode="aspectFill" />
</template>
<script setup name="processDetailStateImg">
	import { prefixUrl } from "@/utils/api-adaptive"
	const props = defineProps({
		stateCode: {
			type: String,
			default: ''
		}
	})
</script>
<style lang="scss" scoped>
	.state-img {
		position: absolute;
		z-index: 10;
		right: 30rpx;
		opacity: 0.7;
		width: 150rpx;
		height: 150rpx;
	}
</style>