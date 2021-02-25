<template>
  <div class="login">
    <van-nav-bar
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <van-form
    :show-error="false"
    :show-error-message="false"
    validate-first
    @submit="onLogin"
    @failed="onFailed"
    ref="loginForm">
      <van-field
        v-model="user.mobile"
        clearable
        left-icon="phone-o"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        left-icon="comment-circle-o"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
        >
        <template #button>
          <van-button class="send-btn" size="mini" round @click.prevent="onSendSms" v-if="isCountDownShow">获取验证码</van-button>
          <van-count-down :time="1000 * 30" format="ss s" @finish="isCountDownShow = true" v-else/>
        </template>
      </van-field>
      <div class="login-btn">
        <van-button button type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name:'LoginIndex',
  data() {
    return {
      user:{
        mobile:'13966666666',  //手机号
        code:'246810'     //验证码
      },
      formRules:{
        mobile:[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code:[
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow:true, //控制倒计时和发送按钮的显示状态
      
      
    }
  },
  methods:{
    async onLogin(){
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, //禁止背景点击
        duration:0
      })
      try{
        const { data:res } = await login(this.user)
        // console.log(data)
        this.$toast.success('登录成功')

        // 将后端返回的登录状态放到vuex容器中
        this.$store.commit('setUser', res.data)
        // 登录成功，跳转回原来页面
        this.$router.back()
      }catch(err){
        // console.log(err)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed(error){
      // console.log(error)
      if(error.errors[0]){
        this.$toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    async onSendSms(){
      try{
        await this.$refs.loginForm.validate('mobile')
        this.isCountDownShow = false

      } catch(err) {
        this.$toast({
          message: err.message,
          position: 'top'
        })
      }
    },




  }
}

</script>

<style lang="less" scoped>
.login-btn{
  padding: 26px 36px;
}
.send-btn{
  width: 76px;
  height: 23px;
  background-color: #ededed;
}
</style>