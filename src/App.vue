<script setup>
import store from '@/store'
// #ifdef H5
import { getH5RouteByUrl } from '@/utils/common'
import { checkPermission } from '@/utils/auth'
checkPermission(getH5RouteByUrl())
//#endif

</script>
<style lang="scss">
@import '@/static/scss/index.scss';
</style>