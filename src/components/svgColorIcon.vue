<!--
 * @Description: a project
 * @Author: boliang.lai
 * @Date: 2023-01-03 14:40:58
 * @LastEditTime: 2023-01-03 14:47:37
 * @LastEditors: boliang.lai
-->
<template>
    <svg class="icon svg-icon" aria-hidden="true">
      <use :xlink:href="`#${iconClass}`"></use>
    </svg>
</template>

<script>

export default {
  name: 'SvgColorIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
  },
};
</script>
