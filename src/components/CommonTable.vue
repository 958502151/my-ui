<template>
    <div class="common-table">
        <div v-if="searchConfig" class="search">
            <span :key="index" v-for="(item, index) in searchConfig">
                <el-space wrap>
                    <span v-if="item.label">{{item.label}}：</span>
                    <el-select v-bind="item" collapse-tags :multiple="item.multiple" filterable clearable v-if="item.type === 'select'" v-model="params[item.prop]" placeholder="">
                        <el-option :key="index" v-for="(opt, index) in item.options" :label="opt.label" :value="opt.value"></el-option>
                    </el-select>

                    <el-input @keydown.enter="pagination.page = 1; search()" :style="{width: item.width || '200px'}" v-bind="item" v-else-if="item.type === 'input'" v-model="params[item.prop]" :placeholder="item.placeholder"></el-input>

                    <el-date-picker v-bind="item" v-else-if="item.type === 'date'" :type="item.dateType" v-model="params[item.prop]" placeholder=""></el-date-picker>
                </el-space>
            </span>
            <slot name="search"></slot>
            <span style="margin-left: 30px">
                <el-button type="warning" @click="pagination.page = 1; search()">查询</el-button>
                <el-button type="info" @click="clear">清空</el-button>
                <el-button :type="item.type" v-for="(item, index) in topButton" v-bind="item" v-on="item" :key="index">{{item.name}}</el-button>
            </span>
        </div>
        
        <div v-if="height" class="table-box">
            <div style="margin-top: 30px" v-if="tableConfig" class="table">
                <el-table
                    :cell-style="{ background: '#133263', color: 'white' }"
                    ref="table"
                    :data="dataSource"
                    :height="height"
                    :header-cell-style="{'backgroundColor': '#024c96'}"
                    @selection-change="handleSelectionChange"
                   >
                    <el-table-column v-if="selection" type="selection" width="55" />
                    <el-table-column v-for="(item, index) in tableConfig.columns" v-bind="item" :key="index"  :label="item.label" :prop="item.prop">
                        <template v-if="item.slot" v-slot="scope">
                            <slot :item="scope.row" :name="item.slot" ></slot>
                        </template>
                        <template v-else-if="item.format" v-slot="scope">
                            <span v-if="item.html" style="white-space: pre-line" @click="item.handleClick(scope.row)" v-bind="item" v-on="item" v-html="item.format(scope.row)"></span>
                            <span v-else :style="item.style && item.style(scope.row)">{{item.format(scope.row)}}</span>
                        </template>
                        <template v-else-if="item.html" v-slot="scope">
                            <span style="white-space: pre-line" v-html="scope.row[item.prop]"></span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
                v-if="tableConfig.pagination != 'none' && pagination.total !== 0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-model:current-page="pagination.pageNo"
                v-model:page-size="pagination.pageSize"
                :page-sizes="pagination.pageSizes"
                :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { reactive, onMounted, ref, nextTick } from 'vue'
import api from '@/api'
import loadingMixin from '@/util/loadingMixin'
import { useRoute } from 'vue-router'
import bus from '@/util/bus'

export default ({
    name: 'CommonTable',
    props: {
        searchConfig: Array,
        tableConfig: Object,
        topButton: Array,
        selection: {
            type: Boolean,
            defalut: false
        }
    },
    setup(prop, {emit}) {
        const {methods} = loadingMixin
        const params = ref({})
        const route = useRoute()

        onMounted(() => {
            const params = {
                ...prop.tableConfig.params
            }
            getData(params)
        })

        const getPage = () => {
            if(localStorage.getItem('search') && (JSON.stringify(route.query) === '{}')) {
                const m = localStorage.getItem('search')
                if(JSON.parse(m).find(fil => fil.name === route.name)) {
                    const {page, pageSize}  = {...JSON.parse(m).find(fil => fil.name === route.name).value}
                    return {page, pageSize}
                } else return {page: 1, pageSize: 10}
            } else return {page: 1, pageSize: 10}
        } 

        const pages = getPage()
                // 分页
        const pagination = reactive({
            page: pages.page,
            pageSize: pages.pageSize,
            pageSizes: [10, 25, 50, 100],
            total: 0,
            offset: 0,
        })

        prop.searchConfig && prop.searchConfig.filter(fil => fil.url).forEach(item => {
            api[item.url](item.params || {}).then(res => {
                if (item.dataCb && typeof item.dataCb === 'function') {
                    item.options = item.dataCb(res.data)
                    return;
                }
                item.options = res.data.map(ma => ({label: ma[item.opL], value: ma[item.opV]}))
            })
        })
        //查询
        const search = () => {
            const m = prop.searchConfig?.find(fin => fin.dateType === 'daterange')
            if(m) {
                const start_time = prop.searchConfig?.find(fin => fin.dateType === 'daterange') && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop] && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop][0] || undefined
                const end_time = prop.searchConfig?.find(fin => fin.dateType === 'daterange') && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop] && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop][1] || undefined
                params.value[m.startL] = start_time,
                params.value[m.endL] = end_time
            }
            getData({
                ...prop.tableConfig.params,
                pageNo: pagination.page,
                pageSize: pagination.pageSize,
                ...params.value
                })
            emit('search', params.value)
        }

        // console.log(onBeforeRouteUpdate)

        const clear = () => {
            params.value = {}
            getData({
                ...prop.tableConfig.params,
                pageNo: pagination.page,
                pageSize: pagination.pageSize
            })
            emit('clear')
        }
        
        const EditSearch = () => {
            getData({
                ...prop.tableConfig.params,
                pageNo: pagination.page,
                pageSize: pagination.pageSize,
                ...params.value
            })
        }

        const dataSource = ref([])
        //table数据
        const getData = (params) => {
            const param = JSON.parse(JSON.stringify(params))
            for(let key in param) {
                if(param[key] === '') {
                        delete param[key]
                    }
            }
            // if(localStorage.getItem('search')) {
            //     const m = localStorage.getItem('search')
            //     const search = JSON.parse(m).filter(fil => fil.name !== route.name)
            //     search.push({name: route.name, value: param})
            //     localStorage.setItem('search', JSON.stringify(search))
            // } else {
            //     localStorage.setItem('search', JSON.stringify([{name: route.name, value: param}]))
            // }

            prop.searchConfig?.filter(fil => fil.multiple).forEach(item => {
                param[item.prop] = param[item.prop]?.join(',')
            })

            methods.loading()
            api[prop.tableConfig.url](param).then(res => {
                if(prop.tableConfig.callback) {
                    dataSource.value = prop.tableConfig.callback(res)
                }
                else { dataSource.value = res.data.list || res.data }
                pagination.total = res.data.totalCount || (res.data && res.data.list.length);
                methods.loadingClose()
            }).catch(err => {
                methods.loadingClose()
            })
        }

        const handleSizeChange = (pageSize) => {
            pagination.pageSize = pageSize;
            if (
                prop.tableConfig.pagination &&
                prop.tableConfig.pagination == "local"
            ) {
                setTableData();
            } else {
                const start_time = prop.searchConfig?.find(fin => fin.dateType === 'daterange') && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop] && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop][0] || undefined
                const end_time = prop.searchConfig?.find(fin => fin.dateType === 'daterange') && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop] && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop][1] || undefined
                params.value.start_time = start_time,
                params.value.end_time = end_time
                getData({
                    pageNo: 1,
                    pageSize: pageSize,
                    ...params.value
                });
                pagination.page = 1;
            }
        }

        const handleCurrentChange = (page) => {
            pagination.page = page;
            pagination.offset =
                (pagination.page - 1) * pagination.pageSize;
            if (
                prop.tableConfig.pagination &&
                prop.tableConfig.pagination == "local"
            ) {
                setTableData();
            } else {
                const start_time = prop.searchConfig?.find(fin => fin.dateType === 'daterange') && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop] && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop][0] || undefined
                const end_time = prop.searchConfig?.find(fin => fin.dateType === 'daterange') && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop] && params.value[prop.searchConfig.find(fin => fin.dateType === 'daterange').prop][1] || undefined
                params.value.start_time = start_time,
                params.value.end_time = end_time
                getData({
                    pageNo: page,
                    pageSize: pagination.pageSize,
                    ...params.value
                });
            }
        }

        let tableDataBak = []

        const setTableData = () => {
            // this.loading = true;
            if (
                prop.tableConfig.pagination &&
                prop.tableConfig.pagination == "local"
            ) {
                dataSource.value = tableDataBak.slice(
                    pagination.offset,
                    pagination.offset + pagination.pageSize
                );
            } else {
                dataSource.value = tableDataBak.slice();
            }
            // this.loading = false;
        }

        const height = ref(null);
        // 自动计算表格高度
        onMounted(() => {
            let wrapper = document.getElementsByClassName('main-wrapper')[0].getBoundingClientRect();
            let search = document.getElementsByClassName('search')[0] && document.getElementsByClassName('search')[0].getBoundingClientRect();
            let breadcrumb = document.getElementById('breadcrumb') && document.getElementById('breadcrumb').getBoundingClientRect();
            height.value = wrapper.height - (search ? search.height : 0) - (breadcrumb ? breadcrumb.height + 20 : 0) - 130;
        })
        
        //多选方法
        const handleSelectionChange = (row) => {
            emit('handleSelectionChange', row)
        }

        const table = ref(null)

        bus.on('menuChange', () => {
            nextTick(() => {
                // table.value.$forceUpdate()
            })
        })
        return {
            params,
            search,
            clear,
            dataSource,
            pagination,
            handleSizeChange,
            handleCurrentChange,
            EditSearch,
            height,
            table,
            handleSelectionChange
        }
    },
})
</script>

<style lang="scss">
.common-table {
    // .table-box {
    //     height: calc(100vh - 170px);
    //     overflow: auto;
    // }
    .el-table {
        --el-table-bg-color: none;
        --el-table-border-color: none;
        --el-table-tr-bg-color: none;
        border-radius: 10px;
        margin-top: 20px;
        font-size: 18px;
        .el-table__cell {
            color: white;
            border-bottom: 1px solid rgba(2, 76, 150, 0.8);
        }
    }
    .el-table .el-table__cell {
        z-index: inherit;
    }
    .el-pagination {
        border-radius: 10px;
        text-align: right;
        background: rgba(2, 76, 150, 0.8);
        color: white !important;
        padding: 20px;
        justify-content: flex-end;
        .el-pagination__total {
            color: white;
        }
        .el-pagination__jump {
            color: white;
        }
    }
    .search {
        line-height: 55px;
    }
}
</style>
