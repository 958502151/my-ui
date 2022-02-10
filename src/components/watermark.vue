<template>
    <div id="watermark">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'

interface Props {
    color: String,
    msg: String,
    fontSize: String
}

const props = withDefaults(defineProps<Props>(), {
    color: () => 'gray',
    fontSize: () => '12px'
})


const setWatermark = (msg: String) => {
    let num = 0;
    let str = 0;
    const regx = /[\u4e00-\u9fa5]/
    Array.from(msg).forEach(item => {
        item.match(regx) ? str++ : num++
    })
    const water: any = document.createElement('canvas')
    const watermark: any = document.getElementById('watermark')
    const ctx = water.getContext('2d')
    ctx.rotate(-20*Math.PI/180)
    ctx.font = `${props.fontSize} Georgia`
    ctx.fillStyle = props.color
    ctx.fillText(msg, 0, num*2 + str*10)
    watermark.style.backgroundImage = `url(${ctx.canvas.toDataURL()})`
}

onMounted(() => {
    nextTick(() => {
        setWatermark(props.msg)
    })
})
</script>

<style>
#watermark {
    height: 100%;
}
</style>