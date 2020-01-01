import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import MiniPlayer from './miniPlayer'
import NormalPlayer from './normalPlayer'
import { getSongUrl, isEmptyObject } from '../../api/utils'

// mock 数据
// const currentSong = {
//   al: { picUrl: 'https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg' },
//   name: '木偶人',
//   ar: [{ name: '薛之谦' }]
// }

function Player (props) {
  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  // 歌曲总时长
  const [duration, setDuration] = useState(0)
  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration

  const audioRef = useRef()
  const {
    fullScreen,
    playingState,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    sequencePlayList: immutableSequencePlayList, // 顺序列表
    playMode
  } = props

  const {
    changeCurrentSongDispatch,
    toggleFullScreenDispatch,
    togglePlayingStateDispatch,
    changeSequencePlayListDispatch,
    changePlayListDispatch,
    changePlayModeDispatch,
    changeCurrentIndexDispatch,
    toggleShowPlayListDispatch
  } = props

  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()
  const currentSong = immutableCurrentSong.toJS()
  console.log(playList)
  console.log(currentSong)

  useEffect(() => {
    if (!playList.length || !currentSong) return false
    changeCurrentIndexDispatch(0) // currentIndex默认为-1，临时改成0
    const current = playList[0]
    changeCurrentSongDispatch(current) // 赋值currentSong
    audioRef.current.src = getSongUrl(current.id)
    console.log(getSongUrl(current.id))
    setTimeout(() => {
      audioRef.current.play()
    })
    togglePlayingStateDispatch(true) // 播放状态
    setCurrentTime(0) // 从头开始播放
    setDuration((current.dt / 1000) | 0) // 时长
  }, [])

  useEffect(() => {
    playingState ? audioRef.current.play() : audioRef.current.pause()
  }, [playingState])

  const clickPlaying = (e, state) => {
    e.stopPropagation()
    togglePlayingStateDispatch(state)
  }

  const updateTime = e => {
    setCurrentTime(e.target.currentTime)
  }

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    if (!playingState) {
      togglePlayingStateDispatch(true)
    }
  }

  return (
    <div>
      {
        isEmptyObject(currentSong) ? null
          : <MiniPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playingState={playingState}
            toggleFullScreen={toggleFullScreenDispatch}
            clickPlaying={clickPlaying}
            percent={percent}
          />
      }
      {
        isEmptyObject(currentSong) ? null
          : <NormalPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playingState={playingState}
            duration={duration}
            currentTime={currentTime}
            percent={percent}
            toggleFullScreen={toggleFullScreenDispatch}
            clickPlaying={clickPlaying}
            onProgressChange={onProgressChange}
          />
      }
      <audio ref={audioRef} onTimeUpdate={updateTime} />
    </div>
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

// 映射 dispatch 到 props 上
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
    changeSequencePlayListDispatch (data) {
      dispatch(actionCreators.changeSequencePlayList(data))
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
