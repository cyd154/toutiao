<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="article-wrap">
      <h1 class="title">{{article.title}}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{article.aut_name}}</div>
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
        <van-button
        class="follow-btn" 
        :icon="article.is_followed ? '' : 'plus'" 
        :type="article.is_followed ? 'default' : 'info'" 
        round 
        size="small"
        @click="onFollow"
        :loading="isFollowLoading"
        >{{article.is_followed ? '已关注' : '关注'}}</van-button>
      </van-cell>
      <!-- 内容区域 -->
      <div 
      ref="article-content" 
      class="markdown-body" 
      v-html="article.content">
      </div>
      <!-- 文章评论列表  -->
      <comment-list :source='articleId' :list="commentpList" />

    </div>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="mini"
        @click="showPopup"
      >写评论</van-button>

      <!-- 发布评论 -->
      <van-popup  v-model="show"  position="bottom"  >
        <post-comment :target="articleId" @post-success="onPostSuccess"  />
      </van-popup>

      <van-icon name="comment-o" badge="999" color="#777" />
      <!-- 收藏按钮 -->
      <van-icon
        @click="onCollect"
        :color="article.is_collected ? 'orange' : '#777'" 
        :name="article.is_collected ? 'star' : 'star-o'"
      />
      <!-- 点赞按钮 -->
      <van-icon
        @click="onLike"
        :color="article.attitude === 1 ? '#f2385d' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'" />
      <!-- 转发按钮 -->
      <van-icon color="#777" name="share-o" />
    </div>
  </div>
</template>

<script>
import './github-markdown.css'
import { 
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addFollow,deleteFollow } from '@/api/user'
import { ImagePreview } from 'vant'
import { mapState } from 'vuex'
import CommentList from './component/comment-list'
import PostComment from './component/post-comment'

export default {
  name: 'ArticleIndex',
  data (){
    return {
      article:{},  //文章数据对象
      isFollowLoading:false, //关注用户按钮的loading状态
      show: false,  //弹出层显示与隐藏
      commentpList: [] //文章评论列表
    }
  },
  props:{
    articleId:{
      type:[String,Number,Object],
      required: true
    }
  },
  components:{
    CommentList,
    PostComment
  },
  created (){
    this.loadArticle()
  },
  computed:{
    ...mapState(['user'])
  },
  methods: {
    async loadArticle(){
      const { data } = await getArticleById(this.articleId)
      // console.log(data);
      this.article = data.data
      this.$nextTick(() => {
        this.handleperviewImage()
      })
    },

    //处理图片预览
    handleperviewImage(){
      //获取文章内容DOM容器
      const articleContent = this.$refs['article-content']
      // 得到所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      //数据改变影响视图更新（DOM数据）不是立即的
      //所以如果需要在修改数据之后马上操作被该数据影响的视图DOM，需要把这个代码放到 $nextTick 中
      const imgPaths = []
      // 循环img列表,给img注册点击事件
      // 在事件处理函数中调用ImagePreview()预览
      imgs.forEach((img, index)=> {
        imgPaths.push(img.src)
        img.onclick = function (){
          ImagePreview({
              images: imgPaths, //预览图片路径列表
              startPosition: index, //点击图片起始位置
          })
        }
      })
    },

    async onFollow(){
      if(!this.user){
        this.$toast.fail('请先登录!')
      }else{
        this.isFollowLoading = true
        if(this.article.is_followed){
          // 已关注,取消关注
          await deleteFollow(this.article.aut_id)
        }else{
          // 未关注,添加关注
          await addFollow(this.article.aut_id)
        }
          this.article.is_followed = !this.article.is_followed
          this.isFollowLoading = false
      }
    },
    async onCollect(){
      if(!this.user){
        this.$toast.fail('请先登录!')
      }else{
        this.$toast.loading({
          message:'操作中...',
          forbidClick:true  //禁止背景点击
        })
        if(this.article.is_collected){
          // 已收藏,取消收藏
          await deleteCollect(this.articleId)
        }else{
          // 未收藏,添加收藏
          await addCollect(this.articleId)
        }
          this.article.is_collected = !this.article.is_collected
          this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
      }
    },
    async onLike() {
      if(!this.user){
        this.$toast.fail('请先登录!')
      }else{
        this.$toast.loading({
          message:'操作中...',
          forbidClick:true  //禁止背景点击
        })
        if(this.article.attitude === 1){
          // 已点赞,取消点赞
          await deleteLike(this.articleId)
          this.article.attitude = -1
        }else{
          // 未点赞,添加点赞
          await addLike(this.articleId)
          this.article.attitude = 1
        }
        this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
      }
    },
    showPopup() {
      if(!this.user){
        this.$toast.fail('请先登录!')
      }else{
        this.show = true;
      }
    },
    onPostSuccess(comment){
      // console.log(data);
      //把发布成功的评论数据对象放到评论列表顶部
      this.commentpList.unshift(comment)
      //关闭发布评论弹出层
      this.show = false
    }
  }
}
</script>

<style lang="less" scoped>
.title{
  font-size: 20px; 
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}
.user-info{
  .name{
    font-size: 14px;
    color:#333;
  }
  .avatar{
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .pubdate{
    color: #b4b4b4;
    font-size: 11px;
  }
  .follow-btn{
    width: 85px;
    height: 29px;
  }
}
.markdown-body{
  padding: 14px;
  background-color: #fff;
}
.article-wrap{
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
  }
}
.van-nav-bar{
  z-index: 0;
}
</style>
