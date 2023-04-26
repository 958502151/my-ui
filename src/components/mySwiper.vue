<template>
  <div class="my-swiper">
    <div class="swiper-box">
      <div
        @touchstart.stop="touchStart"
        @touchend.stop="touchEnd"
        v-for="(item, index) in dataList"
        class="default" :key="index"
        @click="handeClick(item, index)"
        :class="{left: index === leftIndex, center: index === currentIndex, right: index === rightIndex}">
          <img :src="item.src"/>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mySwiper',
  props: {
    dataList: Array,
  },
  data() {
    return {
      currentIndex: 0,
      positionSX: '',
      positionEX: '',
      positionSY: '',
      positionEY: '',
    };
  },
  computed: {
    leftIndex() {
      if (this.$props.dataList.length - 1 < 1) return -1;
      return this.currentIndex === 0 ? (this.$props.dataList.length - 1) : this.currentIndex - 1;
    },
    rightIndex() {
      if (this.$props.dataList.length - 1 < 1) return -1;
      return this.currentIndex === (this.$props.dataList.length - 1) ? 0 : this.currentIndex + 1;
    },
  },
  methods: {
    handeClick(item, index) {
      if (index === this.leftIndex) {
        this.currentIndex = index;
      } else if (index === this.rightIndex) {
        this.currentIndex = index;
      }
      this.$emit('handeClick', item);
    },

    // 监听左右滑动坐标
    touchStart(e) {
      // 开始x轴坐标
      this.positionSX = e.changedTouches[0].clientX;
      // 开始y轴坐标
      this.positionSY = e.changedTouches[0].clientY;
    },
    touchEnd(e) {
      // 结束x轴坐标
      this.positionEX = e.changedTouches[0].clientX;
      // 结束y轴坐标
      this.positionEY = e.changedTouches[0].clientY;
      const distanceY = this.positionEY - this.positionSY;
      const distanceX = this.positionSX - this.positionEX;
      // 判断滑动 的方向
      if (distanceX > 30 && Math.abs(distanceY) < Math.abs(distanceX)) {
        this.rightSliding();
      }
      if (distanceX < -30 && Math.abs(distanceY) < Math.abs(distanceX)) {
        this.leftSliding();
      }
    },

    // 向右滑动
    rightSliding() {
      this.currentIndex = this.rightIndex;
    },
    // 向左滑动
    leftSliding() {
      this.currentIndex = this.leftIndex;
    },
  },
};
</script>

<style lang="scss">
.my-swiper {
    .swiper-box {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        flex-wrap: nowrap;
        margin: 0 auto;
        transition: 1s;
        height: 200px;
        .default {
          position: absolute;
          z-index: 996;
          img {
            display: none;
          }
        }
        .center {
          display: initial;
          img {
            display: initial;
            width: 580px;
            transition: 1s;
            height: 200px;
            object-fit: cover;
          }
          transition: 1s;
          position: absolute;
          z-index: 999;
        }
        .left {
          display: initial;
          left: 0;
          transform: translateX(-490px);
          img {
            display: initial;
            height: 160px;
            transition: 1s;
            width: 550px;
            border-radius: 0 20px 20px 0;
            object-fit: cover;
          }
          transition: 1s;
          position: absolute;
          z-index: 997;
        }
        .right {
          display: initial;
          right: 0;
          transform: translateX(490px);
          img {
            display: initial;
            height: 160px;
            transition: 1s;
            width: 550px;
            border-radius: 20px 0 0 20px;
            object-fit: cover;
          }
          transition: 1s;
          position: absolute;
          z-index: 998;
        }
    }
}
</style>
