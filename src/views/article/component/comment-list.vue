<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-cell
      v-for="(comment,index) in list" 
      :key="index" 
      :title="comment.content" /> -->
      <comment-item v-for="(comment, index) in list" :key="index" :comment="comment" />
    </van-list>
  </div>
</template>

<script>
import { getComment } from '@/api/comment'
import commentItem from './comment-item.vue'

export default {
  components: { commentItem },
  name: 'CommentList',
  props:{
    source:{
      type:[String,Number,Object],
      required: true
    },
    list:{
      type:Array,
      default: () => []
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset:null,  //获取下页数据页码
      limit:10  //每页大小
    }
  },
  methods:{
    async onLoad() {
      const source = this.source.toString()
      const { data } = await getComment({
        type: 'a',  //评论类型，a-对文章(article)的评论,c-对评论(comment)的回复
        source: source, //源id，文章id或评论id
        offset: this.offset, 
        limit:this.limit //每页大小 
      })
      // console.log(data);
      const { results } = data.data
      this.list.push(...results)

      this.loading = false

      if(results.length){
        this.offset = data.data.last_id
      }else{
        this.finished= true
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>