<template>
  <van-cell class="comment-item">
    <van-image
    class="avatar"
      slot="icon"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-warp">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-warp">
          <van-icon 
            class="like-icon" 
            :class="{liked:comment.is_liking}"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
            @click="oncommentLike"
          />
          <span :class="{liked:comment.is_liking}" class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="pubdate-warp">
        <span class="pubdate">{{ comment.pubdate | datetime }}</span>
        <van-button class="reply-btn" round size="mini">{{ comment.reply_count }}回复</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { mapState } from 'vuex';
import { addCommentLike,deleteCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  props:{
    comment:{
      type:Object,
      required:true
    }
  },
  data () {
    return {

    }
  },
  computed:{
    ...mapState(['user'])
  },
  methods:{
    async oncommentLike(){
      if(!this.user){
        this.$toast.fail('请先登录!')
      }else{
        const commentId = this.comment.com_id.toString() 
        if(this.comment.is_liking){
          await addCommentLike(commentId)
          this.comment.like_count--
        }else{
          await deleteCommentLike(commentId)
          this.comment.like_count++
        }
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item{
  .avatar{
    width: 35px;
    height: 35px;
    margin-right: 13px;
  }
  .name{
    font-size: 15px;
    color: #406599;
  }
  .content{
    font-size: 15px;
    color: #222;
  }
  .pubdate{
    font-size: 9px;
    margin-right: 10px;
  }
  .title-warp{
    display: flex;
    justify-content: space-between;
  }
  .like-warp{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pubdate-warp{
    display: flex;
    margin-top: 2px;
  }
  .liked{
    color: #f2385d;
  }
}
</style>