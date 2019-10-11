import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getSingerInfoRequest } from '../../../api/request'

export const changeArtist = (data) => ({
  type: actionTypes.CHANGE_ARTIST,
  data: fromJS(data)
})

const changeSongsOfArtist = (data) => ({
  type: actionTypes.CHANGE_SONGS_OF_ARTIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getSingerInfo = (id) => {
  return (dispatch) => {
    getSingerInfoRequest(id).then(res => {
      console.log(res)
      dispatch(changeArtist(res.artist))
      dispatch(changeSongsOfArtist(res.hotSongs))
      dispatch(changeEnterLoading(false))
    }).catch(() => {
      console.log('歌手数据获取错误')
    })
  }
}
