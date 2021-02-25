<template>
  <div class="home">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        icon="search"
        slot="title"
        type="info"
        round
        size="small"
        >搜索</van-button>
    </van-nav-bar>

    <!-- 文字频道列表 -->
    <van-tabs v-model="active">
      <van-tab
      v-for="channel in channels"
      :key="channel.id"
      :title="channel.name"
      >
        <article-list :channel="channel" />
      </van-tab>
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div slot="nav-right" class="wap-nav-wrap">
        <van-icon @click="isChannelEditshow = true" name="wap-nav" />
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup
    v-model="isChannelEditshow"
    position="bottom"
    round
    closeable
    get-container="body"
    class="channel-edit-popup"
    >
      <channel-edit
      :user-channels="channels"
      :active="active"
      @close='isChannelEditshow = false'
      @upadte-active='onUpdateActive'
       />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storege'

export default {
  name:'HomeIndex',
  components:{
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active:0, //控制被激活的标签
      channels:[],  //频道列表
      isChannelEditshow:false //控制编辑频道的显示状态
    }
  },
  created() {
    this.loadChannels()
  },
  computed:{
    ...mapState(['user'])
  },
  methods:{
    async loadChannels() {
      let channels = []
      if(this.user){
        // 已登录，请求获取线上用户频道列表数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      }else{
        // 未登录,判断是否有本地存储的频道列表数据
        const loadChannels = getItem('user-channels')
        // 如果有本地存储的频道列表，则使用
        if(loadChannels){
          channels = loadChannels
        }else{
          // 用户没有登录，也没有本地存储的频道列表，那就请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中供模板使用
      this.channels = channels
    },
    onUpdateActive(index){
      this.active = index
      // console.log(index);
    }
  }

}
</script>

<style lang="less" scoped>
.home{
  /deep/ .van-nav-bar__title{
    max-width: none;
  }
  .search-btn{
    width: 277px;
    height: 32px;
    background: #5babfb;
  }
  /deep/ .van-tabs__line{
    background-color: #5babfb;
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    height: 44px;
    line-height: 50px;
    background-color: #fff;
    opacity: 0.9;
    width: 33px;
  }
  .wap-nav-placeholder{
    width: 30px;
    flex-shrink: 0;
  }
}


.channel-edit-popup{
    height: 100%;
  }
</style>