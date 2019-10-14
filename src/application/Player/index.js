import React from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'

function Player (props) {
  const {
    currentSong, fullScreen, playingState, sequencePlayList,
    playList, playMode, currentIndex, showPlayList } = props
  
  const { changeCurrentSongDispatch,
    toggleFullScreenDispatch,
    togglePlayingStateDispatch,
    changeSequecePlayList,
    changePlayList,
    changePlayMode,
    changeCurrentIndex,
    toggleShowPlayListDispatch
    } = props
  return (
    <div>Player</div>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  currentSong: state.getIn(['player', 'currentSong']),
  fullScreen: state.getIn(['player', 'fullScreen']),
  playingState: state.getIn(['player', 'playingState']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  playList: state.getIn(['player', 'playList']),
  playMode: state.getIn(['player', 'playMode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  showPlayList: state.getIn(['player', 'showPlayList'])
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentSongDispatch (data) {
      dispatch(actionCreators.changeCurrentSong(data))
    },
    toggleFullScreenDispatch (data) {
      dispatch(actionCreators.changeFullScreen(data))
    },
    togglePlayingStateDispatch (data) {
      dispatch(actionCreators.changePlayingState(data))
    },
    changeSequecePlayListDispatch (data) {
      dispatch(actionCreators.changeSequecePlayList(data))
    },
    changePlayListDispatch (data) {
      dispatch(actionCreators.changePlayList(data))
    },
    changePlayModeDispatch (data) {
      dispatch(actionCreators.changePlayMode(data))
    },
    changeCurrentIndexDispatch (data) {
      dispatch(actionCreators.changeCurrentIndex(data))
    },
    toggleShowPlayListDispatch (data) {
      dispatch(actionCreators.changeShowPlayList(data))
    }
  }
}
// 映射dispatch到props上
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))
