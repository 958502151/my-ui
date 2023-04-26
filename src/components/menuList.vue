<template>
    <el-scrollbar class="menu-list">
        <template v-for="item in list" :key="item.id">
            <el-menu-item @click="clickMenu(item.report_id)" v-if="!item.childrens || item.childrens.length === 0"
                        :index="(edit || view) ? item.report_id : (item.report_id.indexOf('http') !== -1 ? '' : item.report_id+'')">
                <el-icon v-if="item.id < 20 && item.icon"><component v-bind:is="item.icon"></component></el-icon>
                <template #title>
                    <div class="menu-title">
                        <span>{{item.report_name}}</span>
                        <div v-if="edit && item.report_id === activeIndex" style="display: flex; align-items: center;">
                            <el-button @click.stop="handleClick('edit', item)" plain size="small">编辑</el-button>
                            <el-button @click.stop="handleClick('add', item)" plain size="small">新增</el-button>
                            <el-popconfirm
                                confirm-button-text="是"
                                cancel-button-text="否"
                                :icon="InfoFilled"
                                cancel-button-type="text"
                                confirm-button-type="warning"
                                icon-color="#e6a23c"
                                title="确实删除该菜单?"
                                @confirm="handleClick('del', item)"
                            >
                                <template #reference>
                                    <el-button @click.stop="" plain size="small" type="danger">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <el-checkbox v-if="check" v-model="item.check" @change="handleCheck(item, $event)"></el-checkbox>
                    </div>
                </template>
            </el-menu-item>
            <el-sub-menu v-else
                        :index="item.id+''">
                <template #title>
                    <el-icon v-if="item.id < 20 && item.icon"><component v-bind:is="item.icon"></component></el-icon>
                    <div class="menu-title">
                        <span v-show="!collapse">{{item.report_name}}</span>
                        <div v-if="edit && item.id === openedMenu" style="display: flex; align-items: center;">
                            <el-button @click.stop="handleClick('edit', item)" plain size="small">编辑</el-button>
                            <el-button @click.stop="handleClick('add', item)" plain size="small">新增</el-button>
                            <el-popconfirm
                                confirm-button-text="是"
                                cancel-button-text="否"
                                :icon="InfoFilled"
                                cancel-button-type="text"
                                confirm-button-type="warning"
                                icon-color="#e6a23c"
                                title="确实删除该菜单?"
                                @confirm="handleClick('del', item)"
                            >
                                <template #reference>
                                    <el-button @click.stop="" plain size="small" type="danger" >删除</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <el-checkbox v-if="check" v-model="item.check" :indeterminate="indeterminate(item)" @change="handleCheck(item, $event)"></el-checkbox>
                    </div>
                </template>
                <template #default>
                    <menu-list :checkList="checkList" @btnClick="handleClick" @handleCheck="handleCheck" :check="check" :edit="edit" :list="item.childrens" :view="view"></menu-list>
                </template>
            </el-sub-menu>
        </template>
    </el-scrollbar>
</template>

<script>
// import { InfoFilled } from '@element-plus/icons-vue'
import bus from '@/util/bus'
import { computed, inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default ({
    name: "menuList",
    // components: { MenuList },
    props: {
        list: Array,
        collapse: Boolean,
        edit: {
            type: Boolean,
            default: false
        },
        view: {
            type: Boolean,
            default: false
        },
        check: {
            type: Boolean,
            default: false
        },
        checkList: Array
    },
    setup(prop, {emit}) {
        const route = useRoute()
        const router = useRouter()

        const clickMenu = (report_id) => {
            if(prop.view || prop.edit) return
            if(report_id.indexOf('http') !== -1 && !prop.edit) {
                // router.push({path: '/iframe', query: {url}})
                window.open(report_id)
            } else if (route.fullPath === report_id) {
                bus.emit('flush')
            } else if(!prop.edit) {
                router.push(report_id)
            }
        }
        const rootMenu = inject('rootMenu')
        const activeIndex = ref(rootMenu.activeIndex)

        const openedMenu = ref(null)

        watch(rootMenu, (val) => {
            if ( val.activeIndex !== activeIndex.value ) {
                activeIndex.value = val.activeIndex
            }
            if (openedMenu.value !== val.openedMenus[0]) {
                openedMenu.value = val.openedMenus[0]
            }
            // activeIndex = val
        }, { deep: true })

        const handleClick = (name, item) => {
            emit('btnClick', name, item)
        }

        const handleCheck = (items, flag) => {
            if(flag) {
                items.check = true
                items.childrens?.forEach(item => {
                    item.check = true
                })
            } else {
                items.check = false
                items.childrens?.forEach(item => {
                    item.check = false
                })
            }
            emit('handleCheck', items, flag)
        }
        
        const indeterminate = computed(() => {
            return (item) => {
                if(!(item.childrens.filter(fil => fil.check).length > 0 && item.childrens.filter(fil => fil.check).length < item.childrens.length)) {
                    setTimeout(() => {
                        prop.list.forEach(items => {
                            if(items.childrens.find(fin => fin.check)) {
                                items.check = true
                            } else {
                                if(items.childrens?.length)
                                items.check = false
                            }
                        })
                    }, 0)
                }
                return item.childrens.filter(fil => fil.check).length > 0 && item.childrens.filter(fil => fil.check).length < item.childrens.length
            }
        })

        return {
            // ...props
            edit: prop.edit,
            check: prop.check,
            handleClick,
            activeIndex,
            openedMenu,
            handleCheck,
            indeterminate,
            clickMenu
        }
    },
})
</script>

<style lang="scss">
.menu-list {
    height: 100%;
    overflow: auto;
    .el-submenu {
        min-width: none !important;
    }
    .menu-title {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
    }
}
.el-submenu {
    min-width: none !important;
}

.el-sub-menu__title {
    padding:  0 var(--el-menu-base-level-padding);
}

.el-menu--collapse .el-submenu__title span {
    display: none !important;
}

.el-sub-menu__icon-arrow {
    display: none !important;
}
</style>