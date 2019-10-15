import React, { useRef } from 'react'
import { getName } from '../../../api/utils'
import { MiniPlayerContainer } from './style'
import { CSSTransition } from 'react-transition-group'
import ProgressCircle from '../../../baseUI/progress-circle'

function MiniPlayer (props) {
  const miniPlayerRef = useRef()
  const { song, fullScreen, playingState, percent } = props
  const { toggleFullScreen, clickPlaying } = props

  return (
    <CSSTransition
      classNames='mini'
      in={!fullScreen}
      timeout={400}
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex'
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none'
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreen(true)}>
        <div className='icon'>
          <div className='imgWrapper'>
            <img className={`play ${playingState ? '' : 'pause'}`} src={song.al.picUrl} width='40' height='40' alt='img' />
          </div>
        </div>
        <div className='text'>
          <h2 className='name'>{song.name}</h2>
          <p className='desc'>{getName(song.ar)}</p>
        </div>
        <div className='control'>
          <ProgressCircle radius={32} percent={percent}>
            {
              playingState
                ? <i className='icon-mini iconfont icon-pause' onClick={e => clickPlaying(e, false)}>&#xe650;</i>
                : <i className='icon-mini iconfont icon-play' onClick={e => clickPlaying(e, true)}>&#xe61e;</i>
            }
          </ProgressCircle>
        </div>
        <div className='control'>
          <i className='iconfont'>&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer)
