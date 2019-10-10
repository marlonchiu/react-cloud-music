import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getAlbumDetailRequest } from '../../../api/request'

export const changeCurrentAlbum = (data) => ({
  type: actionTypes.CHANGE_CURRENT_ALBUM,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getAlbumList = (id) => {
  return (dispatch) => {
    getAlbumDetailRequest(id).then(res => {
      console.log(res)
      const data = res.playlist
      dispatch(changeCurrentAlbum(data))
      dispatch(changeEnterLoading(false)) // 改变loading
    }).catch(() => {
      console.log('album数据获取错误')
    })
  }
}
