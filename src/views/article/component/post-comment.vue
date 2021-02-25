<template>
  <div class="post-comment">
    <van-field
      v-model="message"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="写评论..."
      show-word-limit
    />
    <van-button
      class="post-btn"
      type="info"
      size="mini"
      @click="onPost"
      :disabled="!message"
    >发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'

export default {
  name: 'PostComment',
  props:{
    target:{
      type:[Number,String,Object],
      required:true
    },
    articleId:{
      type:[Number,String,Object],
      default:null
    }
  },
  data() {
    return {
      message:''
    }
  },
  methods:{
    async onPost() {
      this.$toast.loading({
        message:'发布中',
        forbidClick: true
      })
      const { data } = await addComment({
        target: this.target.toString(),  //评论目标id
        content: this.message,  //评论内容
        art_id: this.articleId  ?  this.articleId.toString() : null   //文章id
      })
      // console.log(data);
      this.$emit('post-success',data.data.new_obj)
      this.$toast.success('发布成功')
      this.message = ''
    }
  }
}
</script>

<style lang="less" scoped>
.post-btn{
  float: right;
  padding: 10px;
  margin: 5px;
}
</style>