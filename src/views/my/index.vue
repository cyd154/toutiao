<template>
  <div class="my">
    <van-cell-group v-if="user" class="my-info">
      <van-cell class="base-info" center :border="false">
        <van-image 
        class="avatar"
        slot="icon"
        :src="currentUser.photo"
        round
        fit="cover" />
        <div class="name" slot="title">{{currentUser.name}}</div>
        <van-button class="update-btn" size="small" round>编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <img class="mobile" src="./手机.png">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid" :column-num="2" icon-size="22px">
      <van-grid-item class="nav-grid-item" icon="star-o" text="收藏"  />
      <van-grid-item class="nav-grid-item" icon="clock-o" text="历史" />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell title="智能客服" is-link to="" />
    <van-cell 
      class="logout-cell"
      title="退出登录"
      @click="onLogout"
      v-if="user"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name:'MyIndex',
  data(){
    return {
      currentUser:{} //当前登录用户信息
    }
  },
  computed:{
    ...mapState(['user'])
  },
  created(){
    this.loadCurrentUser()
  },
  methods:{
    onLogout(){
      //提示用户确认退出
      //确认 -> 处理退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？',
        confirmButtonColor:'#308eeb'
      })
        .then(() => {
          //清除用户登录状态
          this.$store.commit('setUser',null)
        })
        .catch(() => {
          // on cancel
        });
    },
    async loadCurrentUser(){
      const { data } = await getCurrentUser()
      // console.log(data);
      this.currentUser = data.data
    }
  }
}
</script>

<style lang="less" scoped>
.my-info{
  background: url('./banner.png') no-repeat;
  background-size: cover;
}
.base-info{
  box-sizing: border-box;
  height: 115px;
  background-color: unset;
  padding-top: 38px;
  padding-bottom: 11px;
  .avatar{
    box-sizing: border-box;
    width: 66px;
    height: 66px;
    border: 1px solid #fff;
    margin-right: 11px;
  }
  .name{
    color: #fff;
    font-size: 15px;
  }
  .update-btn{
    height: 25px;
    font-size: 10px;
    color: #666
  }
}
/deep/ .van-grid-item__content{
  background-color: unset;
}
.data-info{
  .data-info-item{
    height: 65px;
    color: #fff;
    .count{
      text-align: center;
      font-size: 18px;
    }
    .text{
      font-size: 11px;
      text-align: center;
    }
  }
}
/deep/ .nav-grid{
  .nav-grid-item{
    box-sizing: border-box;
    height: 70px;
    .van-icon-star-o{
      color: #eb5253;
    }
    .van-icon-clock-o{
      color: #ff9d1d;
    }
    .van-grid-item__text{
      font-size: 14px;
      color: #333;
    }
  }
}
.logout-cell{
  text-align: center;
  color: #d86262;
  margin-top: 4 px;
}
.not-login{
  height: 180px;
  background: url('./banner.png') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .mobile{
    width: 66px;
    height: 66px;
  }
  .text{
    color: #fff;
    font-size: 14px;
  }
}
</style>