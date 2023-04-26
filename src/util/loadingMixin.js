import { ElLoading } from 'element-plus'

let loadingInstance
export default {
    methods: {
        loading () {
            loadingInstance = ElLoading.service({
                lock: true,
                text: '加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                customClass: 'custom-loading'
            })
        },
        loadingClose () {
            loadingInstance.close()
        }
    }
}