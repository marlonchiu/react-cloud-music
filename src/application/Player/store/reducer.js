import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { playModeObject } from './../../../api/config'

const defaultState = fromJS({
  currentSong: {},
  fullScreen: false, // 播放器是否为全屏模式
  playingState: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表(因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  playMode: playModeObject.sequence, // 播放模式
  currentIndex: 0, // 当前歌曲在播放列表的索引位置
  showPlayList: false // 是否展示播放列表
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set('currentSong', action.data)
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data)
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playingState', action.data)
    case actionTypes.SET_SEQUENCE_PLAYLIST:
      return state.set('sequencePlayList', action.data)
    case actionTypes.SET_PLAYLIST:
      return state.set('playList', action.data)
    case actionTypes.SET_PLAY_MODE:
      return state.set('playMode', action.data)
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data)
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlayList', action.data)
    default:
      return state
  }
}
