// actionCreators.js // 放不同action的地方
import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getBannnerRequest, getRecommendListRequest } from '../../../api/request'

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
})

export const getBannerList = () => {
  return (dispatch) => {
    getBannnerRequest().then(data => {
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
    }).catch(() => {
      console.log('推荐歌单数据获取错误')
    })
  }
}
