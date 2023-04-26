import api from '@/api'

// 日志埋点工具
export function optLog(url, model, urlState) {
    const { mobile = '', userId, userName } = JSON.parse(sessionStorage.getItem('userInfo'))
    const params = {
        url,
        model,
        urlState,
        mobile,
        userId,
        userName
    }
    api.optLog(params)
}

import moment from 'moment'

// 日期格式化
export function dateFormat (date, format) {
    if (!date || !format) return ''
    return moment(date).format(format)
}

// 时间格式化
export function timeFormat (time, format) {
    if (!time || !format) return ''
    return moment(time).format(format)
}

// 是否闰年
export function isLeapYear (year) {
    if (getType(year) != 'number') return false
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)
}

// 获取月份天数
export function getMonthDays (date) {
    if (getType(date) != 'date') return 0
    const year = new Date(date).getFullYear()
    const month = new Date(date).getMonth() + 1
    return new Date(year, month, 0).getDate()
}

// 获取数据类型
export function getType (param) {
    const type = Object.prototype.toString.call(param)
    const typeMap = {
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object String]': 'string',
        '[object Number]': 'number',
        '[object Boolean]': 'boolean',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Object]': 'object',
        '[object Date]': 'date'
    }
    return typeMap[type]
}

// 数组分组 fn -> 为了分组依据，如：item => item.parentId，数组将依据parentId分组
export function groupBy (list, fn) {
    const groups = {}
    if (getType(list) !== 'array') return {}
    list.forEach(item => {
        const group = JSON.stringify(fn(item))
        groups[group] = groups[group] || []
        groups[group].push(item)
    })
    return groups
}

// 邮箱验证
export function isEmail (s) {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

// 验证邮编
export function isPostCode (s) {
    return /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/g.test(s)
}

// 验证手机号码
export function isPhone (s) {
    return /^1[0-9]{10}$/.test(s)
}

// 验证座机号码
export function isFixedPhone (s) {
    return /^\d{3}-\d{8}|\d{4}-\d{7}$/g.test(s)
}

// 验证URL地址
export function isURL (s) {
    return /^http[s]?:\/\/.*/.test(s)
}

// 验证身份证
export function isIdCard (s) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(s)
}

// 验证是否移动端
export function isMobile () {
    var u = navigator.userAgent.toLowerCase()
    return !!u.match(/AppleWebKit.*Mobile.*/)
}

// 验证是否微信环境
export function isWx () {
    var u = navigator.userAgent.toLowerCase()
    return u.toLowerCase().indexOf('micromessenger') !== -1
}

// 验证ip地址
export function isIp (s) {
    var res =/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; // 正则表达式
    if (res.test(s)) {
        if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)
        return true
    }
    return false
}

// 验证统一社会信用代码 (营业执照)
export function isLicense (s) {
    return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(s)
}

// 验证是否迅雷链接
export function isThunderLink (s) {
    return /^thunderx?:\/\/[a-zA-Z\d]+=$/g.test(s)
}

// 验证手机机身码
export function isIMEI (s) {
    return /^\d{15,17}$/.test(s)
}

// 验证密码强度
export function checkPwd (s) {
    var lvl = 0
    if (s.match(/[0-9]/)){
        lvl++
    }
    if (s.match(/[a-zA-Z]/)) {
        lvl++
    }
    if (s.match(/[^0-9a-zA-Z]/)) {
        lvl++
    }
    if (s.length < 6) {
        lvl--
    }
    return lvl
}

// 获取指定范围随机数
export function getRandomNumber (min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min
    return num
}

// 验证车牌号(新能源+非新能源)
export function isCarNumber (s) {
    return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(s)
}

/**
 * 火车车次校验
  G—— 高铁
  D——动bai车组列车—du—简称：动车
  Z——直达特快旅客列车——简zhi称：直特
  T——特快dao旅客列车——简称：特
  K——快速旅客列车(跨局)——简称：快
  N——快速旅客列车(管内)——简称：内
  L——临时旅客列车(跨局)——简称：临
  A——临时旅客列车(管内)——简称：临A
  Y——旅游列车——简称：游
  X——行包专列——简称：行
 * */
export function isTrainNumber (s) {
    return /^(G|C|D|Z|S|T|K|D|X|P|L|\d{1})\d{1,4}$/.test(s)
}

// 防抖
export function debounce(func, wait) {
    let timer;
    return function () {
        let args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, wait)
    }
}

// 节流
export function throttle(func, wait) {
    let previous = 0;
    return function () {
        let now = Date.now(), content = this, args = arguments;
        if (now - previous >wait) {
            func.apply(content, args);
            previous = now;
        }
    }
}

// 获取指定日期段
export function rangeDate(endTime, days) {
    const date = new Date(endTime)
    let year = date.getFullYear();       //年
    let month = date.getMonth() + 1;     //月
    let day = date.getDate();     //日
    // this.getData(`${year}-${month}-${day}`)
    const startDate = new Date(date.getTime() - 3600 * 1000 * 24 * days)
    let startYear = startDate.getFullYear();       //年
    let startMonth = startDate.getMonth() + 1;     //月
    let startDay = startDate.getDate();     //日
    return {end_time: `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`, start_time: `${startYear}-${startMonth > 9 ? startMonth : '0' + startMonth}-${startDay > 9 ? startDay : '0' + startDay}`}
}

// 格式化数字
export function formatNumber(number) {
    let type = ''
    if(number === null || number === undefined || number === 'Infinity') return number
    if(typeof number === 'number') number = number.toString()
    if((typeof number) === 'string' && number.startsWith('-')) {
        type = '-'
        number = number.substr(1)
    }
    if(number.indexOf('.') === -1) {
        const i = number.length ? (number.length%3 === 0 ? parseInt(number.length/3)-1 : parseInt(number.length/3)) : 0
        let list = number.split('').reverse()
        for(var m = i; m > 0; m--)
            list.splice(m*3, 0, ',')
        list = list.reverse()
        return type + '' +  list.join('')
    } else {
        const n = number.split('.')
        let m = []
        m.push(formatNumber(n[0]))
        m.push(n[1])
        // n.forEach(item => {
        //     m.push(formatNumber(item))
        // })
        return type + '' + m.join('.')
    }
}

// 获取日期段之内所有日期
export function getYearAndMonthAndDay(start, end) {
    var date_all=[],i=0;
    var startTime = new Date(start);
    var endTime = new Date(end);
    while((endTime.getTime()-startTime.getTime())>=0){
    var year = startTime.getFullYear();
    var month = (startTime.getMonth()+1).toString().length==1?"0"+(startTime.getMonth()+1).toString():(startTime.getMonth()+1).toString();
    var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
    date_all[i]=year+"-"+month+"-"+day;
    startTime.setDate(startTime.getDate()+1);
    i+=1;
    }
    return date_all;
}

// 打水印
export function setWater(name, color) {
    let ctx = document.createElement('canvas');
    ctx.width = 500;
    ctx.height = 300;
    ctx.style.display = 'none';
    let cans = ctx.getContext('2d');
    cans.rotate((-20*Math.PI) / 180);
    cans.font = '16px fangsong';
    cans.fillStyle = color;
    cans.textAlign = 'left';
    cans.textBaseline = 'middle';
    cans.fillText(name, 20, 100);
    cans.save();
    return ctx.toDataURL()
}

// transform object to el-select-options
export function transformObjToOptions(obj, extra) {
    if (getType(obj) != 'object') return [];
    let options = Object.keys(obj).map(v => {
        return { label: obj[v], value: v };
    });
    if (extra) options.unshift(extra);
    return options;
}
