// actionCreators.js // 放不同action的地方
import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getBannerRequest, getRecommendListRequest } from '../../../api/request'

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest().then(data => {
      console.log(data)
      dispatch(changeBannerList(data.banners))
    }).catch(() => {
      console.log('轮播图数据获取错误')
    })
  }
}

export const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListRequest().then(data => {
      console.log(data)
      dispatch(changeRecommendList(data.result))
      // 在获取推荐歌单后，应把loading状态改为false
      dispatch(changeEnterLoading(false)) // 改变loading
    }).catch(() => {
      console.log('推荐歌单数据获取错误')
    })
  }
}
