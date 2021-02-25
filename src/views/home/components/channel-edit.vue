<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道<small>点击切换频道</small></div>
      <van-button
      class="channel-button"
      type="danger"
      plain 
      round
      size="small"
      @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
      class="grid-item"
      :class="{active: index === active}"
      :icon="(isEdit && index !== 0) ? 'clear' : ''"
      v-for="(userChannel,index) in userChannels"
      :key="index"
      :text="userChannel.name"
      @click="onUserChannelClick(userChannel,index)"
      />
    </van-grid>


    <van-cell center :border="false">
      <div slot="title" class="channel-title">全部频道<small>点击添加频道</small></div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
      class="grid-item"
      v-for="(channel,index) in recommendChannels"
      :key="index"
      :text="channel.name"
      @click="onAdd(channel)"
      />
    </van-grid>

  </div>
</template>

<script>
import { getAllChannels,addUserChannel,deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storege'

export default {
  name: 'ChannelEdit',
  props:{
    userChannels:{
      type:Array,
      retuired:true
    },
    active:{
      type:Number,
      retuired:true
    }
  },
  data() {
    return {
      allChannels:[],  //所有频道数据列表
      isEdit:false  //控制编辑的显示状态
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods:{
    async loadAllChannels() {
      const { data } = await getAllChannels()
      // console.log(data);
        this.allChannels = data.data.channels
    },
    async onAdd(channel){
      // console.log(channel);
      this.userChannels.push(channel)
      if(this.user){
        //登录，数据存储到线上
        await addUserChannel({
          channels:[
            { id: channel.id, seq: this.userChannels.length }
          ]
        })
      }else{
        //未登录，数据存储到本地
        setItem('user-channels', this.userChannels)
        
      }
    },
    onUserChannelClick(userChannel,index){
      if(this.isEdit && index !== 0){
      // 编辑状态，删除频道
        this.deleteChannel(userChannel,index)
      }else{
      // 非编辑状态，切换频道
        this.switchChannle(index)
      }

    },
    async deleteChannel(userChannel,index){
      // 如果删除的是当前激活频道之前的频道
      if(index < this.active){
        // 更新激活频道的索引
        this.$emit('upadte-active',this.active - 1)
      }
      // 删除频道
      this.userChannels.splice(index,1)

      if(this.user){
        //登录，数据存储到线上
        await deleteUserChannel(userChannel.id)
      }else{
        //未登录，数据存储到本地
        setItem('user-channels',this.userChannels)
      }
    },
    switchChannle(index){
      // 切换频道
      this.$emit('upadte-active',index)
      // 关闭弹出层
      this.$emit('close')
    }
  },
  computed:{
    ...mapState(['user']),
    //推荐的频道列表
    recommendChannels() {
      // 所有频道 - 我的频道 = 剩下频道
      // filter方法：过滤数据，根据方法返回的布尔值true来收集数据
      return this.allChannels.filter(channel => {
        //判断channel是否属于用户频道
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit{
  padding-top: 50px;
  .channel-title{
    font-size: 16px;
    color: #333;
    small{
      font-size: 12px;
      margin-left: 10px;
      color: #ccc;
    }
  }
  .channel-button{
    width: 60px;
  }
  .grid-item{
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content{
      background-color: #f4f5f6;
    border-radius: 5px;
      .van-grid-item__text{
        font-size: 13px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/.van-grid-item__icon{
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
      z-index: 2;
    }
  }
  .active{
    /deep/ .van-grid-item__text{
      color: #ee0a24 !important;
    }
  }
  
}
</style>
