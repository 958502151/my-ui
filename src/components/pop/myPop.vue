<template>
  <div class='my-pop' v-if="show">
    <div class="pop-box">
      <div class="title">{{title}}</div>
      <div class="message" v-html="message"></div>
      <div class="btn">
        <van-button round :style="{background: color}" @click="handleClick">{{btnName}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myPop',
  data() {
    return {};
  },
  methods: {
    handleClick() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
.my-pop {
    overflow: hidden;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    .pop-box {
      width: 550px;
      height: 410px;
      background: #FFFFFF;
      border-radius: 20px;
      padding: 50px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        // width: 216px;
        height: 50px;
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1D1D1D;
        line-height: 50px;
      }
      .message {
        // width: 280px;
        text-align: left;
        height: 80px;
        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1D1D1D;
        line-height: 40px;
      }
      .btn {
        border-radius: 40px;
        .van-button{
          width: 450px;
          height: 80px;
          // background: #5DBD85;
          font-size: 32px;
          color: white;
          border-radius: 40px;
        }
      }
    }
}
</style>
