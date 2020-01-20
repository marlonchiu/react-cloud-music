import * as actionTypes from './constants'
import { getSongDetailRequest } from '../../../api/request'
import { fromJS } from 'immutable'

export const changeCurrentSong = (data) => ({
  type: actionTypes.SET_CURRENT_SONG,
  data: fromJS(data)
})

export const changeFullScreen = (data) => ({
  type: actionTypes.SET_FULL_SCREEN,
  data
})

export const changePlayingState = (data) => ({
  type: actionTypes.SET_PLAYING_STATE,
  data
})

export const changeSequencePlayList = (data) => ({
  type: actionTypes.SET_SEQUENCE_PLAYLIST,
  data: fromJS(data)
})

export const changePlayList = (data) => ({
  type: actionTypes.SET_PLAYLIST,
  data: fromJS(data)
})

export const changePlayMode = (data) => ({
  type: actionTypes.SET_PLAY_MODE,
  data
})

export const changeCurrentIndex = (data) => ({
  type: actionTypes.SET_CURRENT_INDEX,
  data
})

export const changeShowPlayList = (data) => ({
  type: actionTypes.SET_SHOW_PLAYLIST,
  data
})

export const deleteSong = (data) => ({
  type: actionTypes.DELETE_SONG,
  data
})
