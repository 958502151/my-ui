<template>
    <div class="common-form">
        <el-form ref="ruleForm" label-position="right" :label-width="isWeChat ? '100px' : '100px'" :model="form">
            <div>
                <template v-for="(item, index) in formConfig.slice()" :key="index">
                    <el-form-item :rules="item.rules ? [{required: item.required, message: item.label.replace('：', '') + '不能为空'}, ...item.rules] : {required: item.required, message: item.label.replace('：', '') + '不能为空'}" v-if="!item.show && prevShow(item) && !view" :label="item.label" :prop="item.prop">
                        <el-input @mousewheel.prevent class="wechat-form" :style="`width: ${isWeChat ? '230px' : '350px'}`" v-bind="item" v-on="item" :type="item.inputType || 'text'" :disabled="view || item.disabled && item.disabled.value.includes(myForm[item.disabled.name]) || false" v-if="item.type === 'input'" v-model="myForm[item.prop]" :placeholder="item.placeholder || '请输入'"><template v-if="item.lastIcon" #append>{{item.lastIcon}}</template></el-input>

                        <el-select :disabled="view" class="wechat-form" :style="`width: ${isWeChat ? '230px' : '350px'}`" filterable :multiple="item.multiple" @change="handleChange(item.prop)" v-else-if="item.type === 'select' && item.multiple" v-model="item.value" placeholder="请选择">
                            <el-option v-for="(opt, index) in item.options" :key="index" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>
                        
                        <el-select :disabled="view" :ref="(el) => select.push(el)" class="wechat-form" :style="`width: ${isWeChat ? '230px' : '350px'}`" v-bind="item" v-on="item" :clearable="item.clearable === false ? false : true " filterable @change="handleChange(item.prop)" v-else-if="item.type === 'select' && !item.multiple" v-model="myForm[item.prop]" placeholder="请选择">
                            <el-option v-for="(opt, index) in item.options" :key="index" :label="opt.label" :value="opt.value"></el-option>
                        </el-select>

                        <div v-else-if="item.type === 'input-range'">
                            <el-input :disabled="view" :type="item.inputType || 'text'" style="width: 120px" v-model="item.value.start" :placeholder="item.placeholder || '请输入'"></el-input> ———
                            <el-input :disabled="view" :type="item.inputType || 'text'" style="width: 120px" v-model="item.value.end" :placeholder="item.placeholder || '请输入'"></el-input>
                        </div>

                        <el-date-picker :disabled="view" v-else-if="item.type === 'datetime'" v-bind="item" :type="item.dateType" v-on="item" v-model="myForm[item.prop]" placeholder=""></el-date-picker>
                        
                        <span v-else-if="item.type === 'text'" v-html="item.format ? item.format(myForm[item.prop]) : myForm[item.prop]"></span>
                        
                        <slot v-else-if="item.type === 'slot'" :name="item.prop"></slot>
                        <div v-if="item.note" style="color: #c0c4cc">{{item.note}}</div>
                    </el-form-item>
                    <slot v-if="item.slot" :name="item.slot"></slot>
                </template>
            </div>
            <el-form-item v-if="!isSlot">
                <el-button :loading="loading" type="primary" @click="submitForm">提交</el-button>
                <el-button v-if="!isWeChat" @click="router.go(-1)">返回</el-button>
            </el-form-item>
            <slot v-else :item="myForm" name="footer"></slot>
        </el-form>
    </div>
</template>

<script>
import { reactive, computed, ref, nextTick, watch } from 'vue'
import api from '@/api'
import {useRoute, useRouter} from 'vue-router'
import { ElMessage } from 'element-plus'

export default ({
    name: 'CommonForm',
    props: {
        form: Object,
        formConfig: Array,
        isSlot: {
            type: Boolean,
            default: false
        },
        view: {
            type: Boolean,
            default: false
        }
        // rules: Object
    },
    setup(props, {emit}) {
        const myForm = reactive(props.form)
        const ruleForm = ref(null)
        const router = useRouter()
        const route = useRoute()
        
        const isWeChat = ref(false)

        // 根据前置字段控制字段是否显示
        const prevShow = computed(() => {
            return (item) => {
                if(Array.isArray(item.prev)) {return item.prev.map(ma => ma.value.includes(myForm[ma.name])).find(fin => fin === false) === undefined ? true : false}
                else if(item.prev) return item.prev.value.includes(myForm[item.prev.name])
                else return true
            }
        })

        // 前置字段变化清空当前字段
        const prev = props.formConfig.filter(item => item.prev)
        const next = props.formConfig.filter(item => item.next)
        const handleChange = (prop) => {
            prev.forEach(item => {
                if(Array.isArray(item.prev)) {
                    item.prev.forEach(sub => {
                        if(sub.name === prop) myForm[item.prop] = null
                    })
                }
                else {
                    if(item.prev.name === prop) myForm[item.prop] = null
                }
            })
            // 后置字段根据当前字段变化
            next.forEach(item => {
                if(item.prop === prop) {
                    myForm[item.next] = null
                    if(props.formConfig.find(fin => fin.prop === item.next).format) props.formConfig.find(fin => fin.prop === item.next).options = props.formConfig.find(fin => fin.prop === item.next).format(item.options.find(fin => (fin.value) === (myForm[prop])).children)
                    else props.formConfig.find(fin => fin.prop === item.next).options = item.options.find(fin => (fin.value) === (myForm[prop])).children.map(ma => ({label: ma[item.chL], value: ma[item.chV]}))
                }
            })

            if(props.formConfig.find(fin => fin.prop === prop).multiple)
            myForm[prop] = props.formConfig.find(fin => fin.prop === prop) && props.formConfig.find(fin => fin.prop === prop).value && props.formConfig.find(fin => fin.prop === prop).value.join(',') || ''
        }

        // 默认值
        props.formConfig.forEach(element => {
            if(!myForm[element.prop] && (element.default || element.default === 0)) {myForm[element.prop] = element.default}
        });

        const multiple = props.formConfig.filter(fil => fil.multiple)

        props.formConfig.filter(fil => fil.buffData).forEach(item => {
            watch(() => myForm[item.subkey], () => {
                myForm[item.prop] = myForm[item.subkey] && myForm[item.subkey].tag
            }, {deep: true})
        })

        props.formConfig.filter(fil => fil.type === 'input-range').forEach(item => {
            watch(() => myForm[item.prop], () => {
                item.value.start = myForm[item.prop] && myForm[item.prop] !== '' && myForm[item.prop].split(',')[0]
                item.value.end = myForm[item.prop] && myForm[item.prop] !== '' && myForm[item.prop].split(',')[1]
            }, {deep: true})
        })

        multiple.forEach(item => {
            watch(() => myForm[item.prop], () => {
                nextTick(() => {
                    item.value = myForm[item.prop] && myForm[item.prop].split(',') || []
                })
            }, {deep: true})
        })

        next.forEach(item => {
            watch(() => props.formConfig.find(fin => item.prop === fin.prop).options, () => {
                nextTick(() => {
                    if(item.children && item.children.length > 0) {
                        if(props.formConfig.find(fin => fin.prop === item.next).format) {
                            props.formConfig.find(fin => fin.prop === item.next).options = props.formConfig.find(fin => fin.prop === item.next).format(item.options.find(fin => (fin.value) === (myForm[item.prop])) && item.options.find(fin => (fin.value) === (myForm[item.prop])).children || [])
                        }
                        else props.formConfig.find(fin => fin.prop === item.next).options = item.options.find(fin => (fin.value) === (myForm[item.prop])).children.map(ma => ({label: ma[item.chL], value: ma[item.chV]}))
                    }
                })
            }, {deep: true})
        })

        const urlList = props.formConfig.filter(item => item.url)
        const buffData = {}
        urlList.forEach(item => {
            api[item.url](item.params).then(res => {
                if(res.code === '0') {
                    if(item.buffData) buffData[item.prop] = res.data
                    if (item.format) item.options = item.format(res.data)
                    else if(item.typeV === 'number') item.options = res.data.map(ma => ({label: ma[item.opL], value: ma[item.opV]*1}))
                    else if (item.next) {item.options = res.data.map(ma => ({label: ma[item.opL], value: ma[item.opV], children: ma[item.children]}))}
                    else item.options = res.data.map(ma => ({label: ma[item.opL], value: ma[item.opV]}))
                }
            })
        })

        // 提交表单
        const submitForm = async () => {
            let flag = false
            props.formConfig.filter(fil => fil.type === 'input-range').forEach(item => {myForm[item.prop] = item.value?.length !== 0 && (item.value.start || '') + ',' + (item.value.end || '') || ''})
            props.formConfig.filter(fil => fil.multiple).forEach(item => myForm[item.prop] = item.value.join(','))
            props.formConfig.filter(fil => fil.buffData).forEach(item => {
                myForm[item.subkey] = buffData[item.prop].find(fin => fin[item.prop] === myForm[item.prop])
            })
            await ruleForm.value.validate((valid, rules) => {
                if (valid) {
                    emit('submit', myForm)
                } else {
                    for(let key in rules)
                    {
                        ElMessage.error(rules[key][0].message)
                        flag = true
                        return false
                    }
                }
            });
            return flag
        }

        const loading = ref(false)

        const select = ref([])
        return {
            myForm,
            prevShow,
            handleChange,
            ruleForm,
            router,
            submitForm,
            isWeChat,
            loading,
            select,
        }
    },
})
</script>

<style lang="scss">
.common-form {

}
</style>
