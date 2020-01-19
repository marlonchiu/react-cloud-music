import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import MiniPlayer from './miniPlayer'
import NormalPlayer from './normalPlayer'
import { getSongUrl, isEmptyObject, findIndex, shuffle } from '../../api/utils'
import { playModeObject } from '../../api/config'
import Toast from './../../baseUI/toast/index'
import PlayList from './playList/index'

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

  // 记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({})
  const [modeText, setModeText] = useState('')
  // const [songReady, setSongReady] = useState(true)

  const audioRef = useRef()
  const toastRef = useRef()

  const {
    fullScreen,
    playingState,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    sequencePlayList: immutableSequencePlayList, // 顺序列表
    playMode // 播放模式
  } = props

  const {
    changeCurrentSongDispatch,
    toggleFullScreenDispatch,
    togglePlayingStateDispatch,
    // changeSequencePlayListDispatch,
    changePlayListDispatch,
    changePlayModeDispatch,
    changeCurrentIndexDispatch,
    toggleShowPlayListDispatch
  } = props

  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()
  const currentSong = immutableCurrentSong.toJS()

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id
    ) return
    let current = playList[currentIndex]
    setPreSong(current)
    // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    // setSongReady(false)
    changeCurrentSongDispatch(current) // 赋值currentSong
    audioRef.current.src = getSongUrl(current.id)
    setTimeout(() => {
      // 注意，play 方法返回的是一个 promise 对象
      console.log(audioRef.current.play()) // Promise{<pending>}
      audioRef.current.play()
      //   .then(() => {
      //   console.log(123)
      //   setSongReady(true)
      // })
    })
    togglePlayingStateDispatch(true) // 播放状态
    setCurrentTime(0) // 从头开始播放
    setDuration((current.dt / 1000) | 0) // 时长
  }, [playList, currentIndex])

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

  // 歌曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayingStateDispatch(true)
    audioRef.current.play()
  }

  // 前一首歌曲
  const handlePrev = () => {
    // 播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    // 如果是第一首了就跳到最后一首
    if (index < 0) index = playList.length - 1
    if (!playingState) togglePlayingStateDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  // 前一首歌曲
  const handleNext = () => {
    // 播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    // 如果是第一首了就跳到最后一首
    if (index === playList.length) index = 0
    if (!playingState) togglePlayingStateDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  const handleEnd = () => {
    if (playMode === playModeObject.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  // 切换播放模式
  const changePlayMode = () => {
    const newMode = (playMode + 1) % 3
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList)
      const index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
      setModeText('顺序循环')
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList)
      setModeText('单曲循环')
    } else if (newMode === 2) {
      // 随机播放
      const newList = shuffle(sequencePlayList)
      const index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setModeText('随机播放')
    }
    changePlayModeDispatch(newMode)
    toastRef.current.show()
  }

  return (
    <div>
      {
        isEmptyObject(currentSong) ? null : (
          <MiniPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playingState={playingState}
            toggleFullScreen={toggleFullScreenDispatch}
            clickPlaying={clickPlaying}
            percent={percent}
            changeShowPlayList={toggleShowPlayListDispatch}
          />
        )
      }
      {
        isEmptyObject(currentSong) ? null : (
          <NormalPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playingState={playingState}
            duration={duration}
            currentTime={currentTime}
            percent={percent}
            toggleFullScreen={toggleFullScreenDispatch}
            clickPlaying={clickPlaying}
            onProgressChange={onProgressChange}
            handlePrev={handlePrev}
            handleNext={handleNext}
            playMode={playMode}
            changePlayMode={changePlayMode}
            changeShowPlayList={toggleShowPlayListDispatch}
          />
        )
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
      />
      {/* 显示播放列表 */}
      <PlayList />
      <Toast text={modeText} ref={toastRef} />
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
    togglePlayingStateDispatch (data) {
      dispatch(actionCreators.changePlayingState(data))
    },
    toggleFullScreenDispatch (data) {
      dispatch(actionCreators.changeFullScreen(data))
    },
    changeCurrentSongDispatch (data) {
      dispatch(actionCreators.changeCurrentSong(data))
    },
    // changeSequencePlayListDispatch (data) {
    //   dispatch(actionCreators.changeSequencePlayList(data))
    // },
    changePlayListDispatch (data) {
      dispatch(actionCreators.changePlayList(data))
    },
    changePlayModeDispatch (data) {
      dispatch(actionCreators.changePlayMode(data))
    },
    changeCurrentIndexDispatch (index) {
      dispatch(actionCreators.changeCurrentIndex(index))
    },
    toggleShowPlayListDispatch (data) {
      dispatch(actionCreators.changeShowPlayList(data))
    }
  }
}
// 映射dispatch到props上
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Player))
