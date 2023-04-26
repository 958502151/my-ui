<template>
  <div id="pmsIndex">
    <div class="pms-body">
        <div style="height: 100%; overflow: hidden; display: flex; flex: auto;">
          <div :span="!isCollapse ? 3 : 1" :class="{'my-collapse': isCollapse}" class="my-no-collapse"><my-menu ref="myMenu"></my-menu></div>
          <div class="main-wrapper" :span="!isCollapse ? 21 : 23" style="height: 100%; overflow: hidden">
            <el-config-provider :locale="zhCn">
              <router-view v-if="flush" class="body"></router-view>
            </el-config-provider>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/views/layout/header.vue'
import MyMenu from '@/views/layout/menu.vue'
import bus from '@/util/bus'
import { ElConfigProvider } from 'element-plus'
import { onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default ({
  name: 'pmsIndex',
  components: {
    MyHeader,
    MyMenu,
    [ElConfigProvider.name]: ElConfigProvider,
  },
  
  setup() {
    const breadcrumb = ref('')

    const route = useRoute()
    const router = useRouter()
    const flush = ref(true)
    bus.on('flush', () => {
      flush.value = false
      nextTick(() => {
        flush.value = true
      })
    })

    bus.on('breadcrumb', (name) => {
      breadcrumb.value = name
    })

    bus.on('menuChange', (value) => {
      isCollapse.value = value
    })

    const myMenu = ref(null)

    onMounted(() => {
      isCollapse.value = myMenu.value.isCollapse
    })
    const isCollapse = ref(false)

    return {
      zhCn,
      breadcrumb,
      myMenu,
      isCollapse,
      route,
      router,
      flush
    }
  },
})
</script>

<style lang="scss">
#pmsIndex {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f9f9f9;
  /* text-align: center; */
  color: #2c3e50;
  height: 100%;
  .pms-body {
    height: 100%;
    .main-wrapper {
      display: flex;
      flex: auto;
      transform: all 2s;
      width: 100%;
      #breadcrumb {
        padding: 8px 15px;
        color: #FF9900;
        border-left: 5px solid #FF9900;
        background: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .body {
        // background: white;
        background: #153a77fd;
        color: white;
        width: 100%;
        height: 100%
      }
    }
    .my-no-collapse {
      // height: 40px;
      transform: all 2s;
      display: flex;
      flex: auto;
    }
  }
}
</style>
