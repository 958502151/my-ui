<template>
    <div class="menu">
      <el-menu
        style="height: 95%; border-right: 0px"
        :collapse="isCollapse"
        :default-active="route.path"
        active-text-color="white"
        background-color="#133263"
        collapse-transition
        unique-opened
        @select="select"
        router
        class="el-menu-vertical-demo">
        <template #default>
          <menu-list :collapse="isCollapse" :list="menu"></menu-list>
        </template>
      </el-menu>
      <el-divider></el-divider>
      <div class="footer">
        <el-icon style="cursor: pointer; color: white;" size="27px" @click="collapseChange"><grid v-if="isCollapse" /><guide v-else /></el-icon>
      </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import menuList from '@/components/menuList.vue'
import { useRoute } from 'vue-router'
import bus from '@/util/bus'
import api from '@/api'

export default ({
    name: 'myMenu',
    components: {menuList},
    setup() {
      const route = useRoute()

      api.getMenu().then(res => {
        // console.log(res)
        menu.value = res.data.leftTree.map(ma => ({
            childrens: ma.children?.map(cma => ({
                report_name: cma.obj.leftName,
                report_id: cma.obj.leftPath,
                id: cma.obj.leftId,
                parent_id: cma.obj.refLeftId,
                sort: cma.obj.sort,
                state: cma.obj.state,
                del_id: cma.obj.id
            })) || [],
            report_name: ma.obj.leftName,
            report_id: ma.obj.leftPath || '',
            id: ma.obj.leftId,
            icon: ma.obj.leftIcon,
            sort: ma.obj.sort,
            state: ma.obj.state,
            del_id: ma.obj.id
        }))
      })

      let menu = ref([])

      onMounted(() => {
        const name = menuConfig(menu.value).find(fin => fin.report_id === route.path)?.report_name
        bus.emit('breadcrumb', name)
      })

      const select = (index) => {
        const name = menuConfig(menu.value).find(fin => fin.report_id === index)?.report_name
        bus.emit('breadcrumb', name)
      }

      // 扁平化菜单
      const menuConfig = (arr) => {
        return arr.reduce((result, item) => {
          return result.concat(item, (Array.isArray(item.childrens) ? menuConfig(item.childrens) : []))
        }, [])
      }

      const isCollapse = ref(false)

      const collapseChange = () => {
        bus.emit('menuChange', !isCollapse.value)
        isCollapse.value = !isCollapse.value
      }
      return {
        menu,
        route,
        select,
        isCollapse,
        collapseChange
      }
    },
})
</script>

<style lang="scss" scope>
    // .el-menu-vertical-demo:not(.el-menu--collapse) {
    //   width: 200px;
    //   min-height: 400px;
    // }
    .menu {
        height: 100%;
        background: #133263;
        transform: all 2s;
        // width: 50px;
    }
    .el-menu-item:focus {
      min-width: 0px;
    }
    .el-menu-item:hover {
      background: #1e4e9cfd;
      min-width: 0px;
    }
    .el-menu-item {
      min-width: 0px !important;
      color: #fff;
    }
    .el-menu-item:hover {
      min-width: 0px;
    }
    .el-menu-item:focus-visible {
      min-width: 0px;
    }
    .el-submenu:focus {
      min-width: 0px;
    }
    .el-submenu:hover {
      min-width: 0px;
    }
    .el-submenu {
      min-width: 0px;
    }
    .el-submenu:focus-visible {
      min-width: 0px;
    }
    .menu .is-active {
      background: #1e4e9cfd;
      border-right: 5px solid #02EBEA;
      min-width: 0px !important;
    }
    .el-sub-menu {
      border-right: 0px solid !important;;
    }
    .el-sub-menu .is-active {
      min-width: 0px !important;
      .el-icon {
        color: #a8a198 !important;
      }
    }
    .el-sub-menu__title {
      color: #fff;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
    }
    .el-divider {
      margin: 1%;
    }
</style>