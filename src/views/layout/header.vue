<template>
  <div class="header">
    <div class="el-menu-demo">
      <span class="title"><img src="https://jt-mbr-test.oss-cn-shenzhen.aliyuncs.com/ctglogo.svg"/></span>
      <!-- <el-menu-item v-for="item in menu" :key="item.id" :index="item.report_id !== '' ? item.report_id : item.id+''" @click="setHome(item)">{{item.report_name}}</el-menu-item> -->
      <span class="logout" style="color: white; display: flex">
        <span style="cursor: pointer; display: flex; align-items: center;" @click="setAccout">
          <el-icon :size="24"><avatar /></el-icon>&ensp;{{userName}}
        </span>
            &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        <span style="cursor: pointer; display: flex; align-items: center;" @click="logout">
          <el-icon :size="24"><switch-button /></el-icon>&ensp;退出登录
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
// import { session } from '@/utils/cookie'
import { ElMessageBox } from 'element-plus'
import api from '@/api'


export default ({
    name: 'myHeader',
    setup() {
      const router = useRouter()

      const logout = () => {
        ElMessageBox.confirm('确认退出登录吗？', '提示', { 
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
           }).then(() => {
              session.clear()
              router.push({ path: '/login' })
              // api.loginOut().then(res => {
              //   if(res.code === 200) {
              //     session.clear()
              //     router.push({ path: '/login' })
              //   }
              // })
        }).catch(() => {})
      }

      const handleMessage = () => {

      }

      const setAccout = () => {
        
      }
      return {
        logout,
        handleMessage,
        setAccout,
        userName: JSON.parse(sessionStorage.getItem('userInfo'))
      }
    },
})
</script>

<style lang="scss">
.header {
    height: 50px;
  .el-menu-demo {
    .title {
      display: inline-block;
      padding: 6px 40px;
      // font-family: fangsong;
    }
    display: flex;
    // align-items: baseline;
    padding-right: 60px;
    .logout {
      margin-left: auto;
    }
    background: #001529;
    background-size: 400% 400%;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>