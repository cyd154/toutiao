<template>
  <div class="article-list">

    <van-pull-refresh
    :success-text="refreshSuccessText"
    v-model="isRefreshLoading"
    @refresh="onRefresh"
    :success-duration="1000"
    >
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
        <article-item v-for="(article,index) in articles" :key="index" :article='article' />
        <!-- <van-cell v-for="(article,index) in articles" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
    
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components:{
    ArticleItem
  },
  props:{
    channel:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      articles: [], //数据列表
      loading: false, //控制加载中loading状态
      finished: false,  //控制加载结束的状态，当加载结束，不再触发加载更多
      timestamp: null,  //获取下一页数据的时间戳
      isRefreshLoading:false, //下拉刷新的loading状态
      refreshSuccessText:''
    }
  },
  methods:{
     async onLoad() {
      const {data} = await getArticles({
        channel_id: this.channel.id,   //频道ID
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })   
      // console.log(data);

      const { results } = data.data
      this.articles.push(...results)

      this.loading = false

      if(results.length){
        this.timestamp = data.data.pre_timestamp
      }else{
        this.finished = true
      }
    },
    async onRefresh(){
      //下拉刷新，组件自己会展示loading状态
      //1.请求获取数据
      const {data} = await getArticles({
        channel_id: this.channel.id,   //频道ID
        timestamp: Date.now(),
        with_top: 1
      })  
      // console.log(data);
      //2.把数据放到列表中（往顶部追加）
      const { results } = data.data
      this.articles.unshift(...results)
      //3.关闭loading刷新的状态
      this.isRefreshLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  },
}
</script>

<style lang="less" scoped>
.article-list{
    position: fixed;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}
</style>