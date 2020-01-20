// actionCreators.js // 放不同action的地方
import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getHotKeyWordsRequest, getSuggestListRequest, getResultSongsListRequest } from '../../../api/request'

export const changeHotKeyWords = (data) => ({
  type: actionTypes.SET_HOT_KEYWRODS,
  data: fromJS(data)
})

export const changeSuggestList = (data) => ({
  type: actionTypes.SET_SUGGEST_LIST,
  data: fromJS(data)
})

export const changeResultSongsList = (data) => ({
  type: actionTypes.SET_RESULT_SONGS_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: actionTypes.SET_ENTER_LOADING,
  data
})

export const getHotKeyWords = () => {
  return (dispatch) => {
    getHotKeyWordsRequest().then(data => {
      // 拿到关键词列表
      let list = data.result.hots
      dispatch(changeHotKeyWords(list))
    }).catch(() => {
      console.log('关键字数据获取错误')
    })
  }
}

export const getSuggestList = (query) => {
  return (dispatch) => {
    getSuggestListRequest(query).then(data => {
      if (!data) return
      let res = data.result || []
      dispatch(changeSuggestList(res))
    }).catch(() => {
      console.log('推荐数据获取错误')
    })
    getResultSongsListRequest(query).then(data => {
      if (!data) return
      let res = data.result.songs || []
      dispatch(changeResultSongsList(res))
      // 在获取推荐歌单后，应把 loading 状态改为false
      dispatch(changeEnterLoading(false)) // 改变loading
    }).catch(() => {
      console.log('推荐数据获取错误')
    })
  }
}
