// pages/home/home.js
import {
  getMultiData,
  getGoodsData
} from '../../service/home.js'

const types = ['pop', 'new', 'sell']
const TOP_DISTANCE = 200
Page({

  /**
   * 页面的初始数据
   */
  data: {
      banners: [],
      recommends: [],
      titles: ['流行', '新款' , '精选'] ,
      goods:{
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': {page: 0 , list: []}
      },
      currentType: 'pop',
      showBacktop: false,
      isTabFixed: false,
      tabScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //1.请求轮播图以及推荐数据
     this._getMultidata()
    this._getGoodsdata('pop')
    this._getGoodsdata('new')
     this._getGoodsdata('sell')
  },
  //-------------------网络请求函数------------------------------
  _getMultidata() {
    //_开头的函数表示私有函数
    getMultiData().then(res => {
      // 取出轮播图和推荐的数据
      const banners = res.data.data.banner.list
      const recommends = res.data.data.recommend.list
      this.setData({
        banners: banners,
        recommends: recommends
      })
    }).catch(err => {
      console.log(err)
    })
  },
  _getGoodsdata(type) {
    //1.获取页码
    const page = this.data.goods[type].page + 1;

    //2.发送网络请求
      getGoodsData(type, page).then(res => {
        res.data.list = ['nini', 'saidi', 'inidhi', 'nini', 'saidi', 'inidhi', 'nini', 'saidi', 'inidhi', 'nini', 'saidi', 'inidhi', 'nini', 'saidi', 'inidhi', 'nini', 'saidi', 'inidhi', 'nini', 'saidi', 'inidhi']
        // console.log(res)
        //2.1.取出数据
        const list = res.data.list

        //2.2.将数据设置到对应type的list里面
        const oldlist = this.data.goods[type].list
        oldlist.push(...list)

        //2.3.将数据设置到data中的goods里面
        const typeKey = `goods.${type}.list`
        const pageKey = `goods.${type}.page`
        this.setData({
          [typeKey]: oldlist,
          [pageKey]: page
        })
      })
  },
  //-------------------事件监听函数------------------------------
  handleTabClick(event) {
    const index = event.detail.index
    this.setData({
      currentType: types[index]
    })
  },
  handleImageLoad() {
      wx.createSelectorQuery().select('#tab-control').boundingClientRect( rect => {
        // console.log(rect)
        this.data.tabScrollTop = rect.top
      }).exec()
  },
  onReachBottom(){
    // console.log('底部')
    // 上拉加载更多
    this._getGoodsdata(this.data.currentType)
  },
  onPageScroll(options){
    const scrollTop = options.scrollTop
    // 不要频繁在滚动函数里面频繁调用this.setData
    const flag1 = scrollTop >= TOP_DISTANCE
    if(flag1 != this.data.showBacktop)
    {
      this.setData({
        showBacktop: flag1
      })
    }

    //修改isTabFixed
    const flag2 = scrollTop >= this.data.tabScrollTop
    if(flag2 != this.data.isTabFixed)
    {
        this.setData({
          isTabFixed: flag2
        })
    }
  }
})