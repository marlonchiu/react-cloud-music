import React, { useRef } from 'react'
import { getName, prefixStyle, formatPlayTime } from '../../../api/utils'
import { NormalPlayerContainer, Top, Middle, Bottom, Operators, CDWrapper, ProgressWrapper } from './style'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'
import ProgressBar from '../../../baseUI/progress-bar'
import { playModeObject } from './../../../api/config'

function NormalPlayer (props) {
  const { song, fullScreen, playingState, percent, duration, currentTime, playMode } = props
  const { toggleFullScreen, clickPlaying, onProgressChange, handlePrev, handleNext, changePlayMode, changeShowPlayList } = props

  const normalPlayerRef = useRef()
  const cdWrapperRef = useRef()

  const transform = prefixStyle('transform')

  // 计算偏移的辅助函数
  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    return {
      x,
      y,
      scale
    }
  }

  // 大播放器进入动画
  const enter = () => {
    normalPlayerRef.current.style.display = 'block'
    // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
    const { x, y, scale } = _getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: {
        transform: 'translate3d(0, 0, 0) scale(1.1)'
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    })
    animations.runAnimation(cdWrapperRef.current, 'move')
  }

  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = cdWrapperRef.current
    animations.unregisterAnimation('move')
    cdWrapperDom.style.animation = ''
  }

  // 离开动画的逻辑
  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = 'all 0.4s'
    const { x, y, scale } = _getPosAndScale()
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }

  const afterLeave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ''
    cdWrapperDom.style[transform] = ''
    normalPlayerRef.current.style.display = 'none'
  }

  // getPlayMode方法
  const getPlayMode = () => {
    let content
    if (playMode === playModeObject.sequence) {
      content = '&#xe625;'
    } else if (playMode === playModeObject.loop) {
      content = '&#xe653;'
    } else {
      content = '&#xe61b;'
    }
    return content
  }

  const handleToggleShowPlayList = (e) => {
    changeShowPlayList(true)
    e.stopPropagation()
  }

  return (
    <CSSTransition
      classNames='normal'
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className='background'>
          <img
            src={song.al.picUrl + '?param=300x300'}
            width='100%'
            height='100%'
            alt='歌曲图片'
          />
        </div>
        <div className='background layer' />
        <Top className='top'>
          <div className='back' onClick={() => toggleFullScreen(false)}>
            <i className='iconfont icon-back'>&#xe662;</i>
          </div>
          <h1 className='title'>{song.name}</h1>
          <h1 className='subtitle'>{getName(song.ar)}</h1>
        </Top>
        <Middle ref={cdWrapperRef}>
          <CDWrapper>
            <div className='cd'>
              <img
                className={`image play ${playingState ? '' : 'pause'}`}
                src={song.al.picUrl + '?param=400x400'}
                alt=''
              />
            </div>
          </CDWrapper>
        </Middle>
        <Bottom className='bottom'>
          <ProgressWrapper>
            <span className='time time-l'>{formatPlayTime(currentTime)}</span>
            <div className='progress-bar-wrapper'>
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              />
            </div>
            <div className='time time-r'>{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className='icon i-left' onClick={changePlayMode}>
              <i className='iconfont' dangerouslySetInnerHTML={{ __html: getPlayMode() }} />
            </div>
            <div className='icon i-left' onClick={handlePrev}>
              <i className='iconfont'>&#xe6e1;</i>
            </div>
            {/* 中间暂停按钮 */}
            <div className='icon i-center'>
              <i
                className='iconfont'
                onClick={e => clickPlaying(e, !playingState)}
                dangerouslySetInnerHTML={{
                  __html: playingState ? '&#xe723;' : '&#xe731;'
                }}
              />
            </div>
            <div className='icon i-right' onClick={handleNext}>
              <i className='iconfont'>&#xe718;</i>
            </div>
            <div className='icon i-right' onClick={handleToggleShowPlayList}>
              <i className='iconfont'>&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}
export default React.memo(NormalPlayer)
