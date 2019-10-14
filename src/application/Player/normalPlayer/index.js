import React, { useRef } from 'react'
import { getName } from '../../../api/utils'
import { NormalPlayerContainer, Top, Middle, Bottom, Operators, CDWrapper } from './style'
import { CSSTransition } from 'react-transition-group'

function NormalPlayer (props) {
  const normalPlayerRef = useRef()
  const { song, fullScreen, playingState, toggleFullScreen } = props
  const enter = () => {
    normalPlayerRef.current.style.display = 'block'
  }
  const afterLeave = () => {
    normalPlayerRef.current.style.display = 'none'
  }
  return (
    <CSSTransition
      classNames='normal'
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
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
        <Middle>
          <CDWrapper>
            <div className='cd'>
              <img
                className='image play'
                src={song.al.picUrl + '?param=400x400'}
                alt=''
              />
            </div>
          </CDWrapper>
        </Middle>
        <Bottom className='bottom'>
          <Operators>
            <div className='icon i-left'>
              <i className='iconfont'>&#xe625;</i>
            </div>
            <div className='icon i-left'>
              <i className='iconfont'>&#xe6e1;</i>
            </div>
            <div className='icon i-center'>
              <i className='iconfont'>&#xe723;</i>
            </div>
            <div className='icon i-right'>
              <i className='iconfont'>&#xe718;</i>
            </div>
            <div className='icon i-right'>
              <i className='iconfont'>&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}
export default React.memo(NormalPlayer)
