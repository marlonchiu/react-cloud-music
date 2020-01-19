import React, { useRef, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style'
import * as actionCreators from '../store/actionCreators'
import { CSSTransition } from 'react-transition-group'
import { prefixStyle, getName, findIndex, shuffle } from './../../../api/utils'
import { playModeObject } from '../../../api/config'
import Scroll from '../../../baseUI/scroll'
import Confirm from '../../../baseUI/confirm/index'

function PlayList (props) {
  const {
    currentIndex,
    currentSong: immutableCurrentSong,
    showPlayList,
    playList: immutablePlayList,
    sequencePlayList: immutableSequencePlayList, // 顺序列表
    playMode // 播放模式
  } = props
  const {
    toggleShowPlayListDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch, // 改变播放列表
    changePlayModeDispatch,
    deleteSongDispatch,
    clearDispatch
  } = props

  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()
  const currentSong = immutableCurrentSong.toJS()

  // 是否允许滑动事件生效
  const [canTouch, setCanTouch] = useState(true)
  // touchStart后记录y值
  const [startY, setStartY] = useState(0)
  // touchStart事件是否已经被触发
  const [initialed, setInitialed] = useState(0)
  // 用户下滑的距离
  const [distance, setDistance] = useState(0)

  const listContentRef = useRef()
  const confirmRef = useRef()
  const playListRef = useRef()
  const listWrapperRef = useRef()
  const [isShow, setIsShow] = useState(false)
  const transform = prefixStyle('transform')

  const onEnterCB = useCallback(() => {
    // 让列表显示
    setIsShow(true)
    // 最开始是隐藏在下面
    listWrapperRef.current.style[transform] = 'translate3d(0, 100%, 0)'
  }, [transform])

  const onEnteringCB = useCallback(() => {
    // 让列表展现
    listWrapperRef.current.style.transition = 'all 0.3s'
    listWrapperRef.current.style[transform] = 'translate3d(0, 0, 0)'
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style.transition = 'all 0.3s'
    listWrapperRef.current.style[transform] = 'translate3d(0px, 100%, 0px)'
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = 'translate3d(0px, 100%, 0px)'
  }, [transform])

  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3;' : ''
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const getPlayMode = () => {
    let content, text

    if (playMode === playModeObject.sequence) {
      content = '&#xe625;'
      text = '顺序播放'
    } else if (playMode === playModeObject.loop) {
      content = '&#xe653;'
      text = '单曲循环'
    } else {
      content = '&#xe61b;'
      text = '随机播放'
    }
    return (
      <div>
        <i
          className='iconfont'
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <span className='text' onClick={(e) => changeMode(e)}>{text}</span>
      </div>
    )
  }

  const changeMode = (e) => {
    const newMode = (playMode + 1) % 3
    // 具体逻辑比较复杂 后面来实现
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList)
      const index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList)
    } else if (newMode === 2) {
      // 随机播放
      const newList = shuffle(sequencePlayList)
      const index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
    }
    changePlayModeDispatch(newMode)
  }

  // 点击切歌实现
  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return
    changeCurrentIndexDispatch(index)
  }

  // 删除歌曲
  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  // 清空歌单
  const handleShowClear = () => {
    confirmRef.current.show()
  }
  const handleConfirmClear = () => {
    clearDispatch()
  }

  // 下滑关闭及反弹效果
  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return
    listWrapperRef.current.style[transform] = ''
    setStartY(e.nativeEvent.touches[0].pageY) // 记录 y 值
    setInitialed(true)
  }
  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return
    let distance = e.nativeEvent.touches[0].pageY - startY
    if (distance < 0) return
    setDistance(distance) // 记录下滑距离
    listWrapperRef.current.style[transform] = `translate3d(0, ${distance}px, 0)`
  }
  const handleTouchEnd = (e) => {
    setInitialed(false)
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      toggleShowPlayListDispatch(false)
    } else {
      // 否则反弹回去
      listWrapperRef.current.style.transition = 'all 0.3s'
      listWrapperRef.current.style[transform] = 'translate3d(0px, 0px, 0px)'
    }
  }
  const handleScroll = (pos) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。
    // 否则一边内容在移动，一边列表在移动，出现 bug
    let state = pos.y === 0
    setCanTouch(state)
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames='list-fade'
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? { display: 'block' } : { display: 'none' }}
        onClick={() => toggleShowPlayListDispatch(false)}
      >
        <div
          className='list_wrapper'
          ref={listWrapperRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className='title'>
              {getPlayMode()}
              <span className='iconfont clear' onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {
                  playList.map((item, index) => {
                    return (
                      <li className='item' key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                        {getCurrentIcon(item)}
                        <span className='text'>{item.name} - {getName(item.ar)}</span>
                        <span className='like'>
                          <i className='iconfont'>&#xe601;</i>
                        </span>
                        <span className='delete' onClick={(e) => handleDeleteSong(e, item)}>
                          <i className='iconfont'>&#xe63d;</i>
                        </span>
                      </li>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
          <Confirm
            ref={confirmRef}
            text={'是否删除全部?'}
            cancelBtnText={'取消'}
            confirmBtnText={'确定'}
            handleConfirm={handleConfirmClear}
          />
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}

// 映射 state 到组件的 props 上
const mapStateToProps = (state) => ({
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']), // 播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']), // 顺序排列时的播放列表
  showPlayList: state.getIn(['player', 'showPlayList']),
  playMode: state.getIn(['player', 'playMode'])
})

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    // 修改当前的歌曲列表
    changePlayListDispatch (data) {
      dispatch(actionCreators.changePlayList(data))
    },
    // 修改当前的播放模式
    changePlayModeDispatch (data) {
      dispatch(actionCreators.changePlayMode(data))
    },
    // 修改当前歌曲在列表中的 index，也就是切歌
    changeCurrentIndexDispatch (index) {
      dispatch(actionCreators.changeCurrentIndex(index))
    },
    // 是否显示播放列表
    toggleShowPlayListDispatch (data) {
      dispatch(actionCreators.changeShowPlayList(data))
    },
    deleteSongDispatch (data) {
      dispatch(actionCreators.deleteSong(data))
    },
    clearDispatch () {
      // 1.清空两个列表
      dispatch(actionCreators.changePlayList([]))
      dispatch(actionCreators.changeSequencePlayList([]))
      // 2.初始currentIndex
      dispatch(actionCreators.changeCurrentIndex(-1))
      // 3.关闭PlayList的显示
      dispatch(actionCreators.changeShowPlayList(false))
      // 4.将当前歌曲置空
      dispatch(actionCreators.changeCurrentSong({}))
      // 5.重置播放状态
      dispatch(actionCreators.changePlayingState(false))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList))
