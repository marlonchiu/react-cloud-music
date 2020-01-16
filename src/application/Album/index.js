import React, { useState, useCallback, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index'
import Scroll from '../../baseUI/scroll/index'
import { Container, TopDesc, Menu } from './style'
import { getCount, isEmptyObject } from '../../api/utils'
import { HEADER_HEIGHT } from './../../api/config'
import style from '../../assets/global-style'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import Loading from '../../baseUI/loading/index'
import MusicNote from '../../baseUI/music-note/index'
import SongsList from '../SongsList'

// mock数据已删除

function Album (props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState('歌单')
  // 是否跑马灯
  const [isMarquee, setIsMarquee] = useState(false)

  const headerEl = useRef()
  // 从路由中拿到歌单的id
  const id = props.match.params.id
  const { currentAlbum: currentAlbumImmutable, enterLoading } = props
  const { getAlbumDataDispatch } = props

  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  const currentAlbum = currentAlbumImmutable.toJS()

  const musicNoteRef = useRef()
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y })
  }
  // useCallback优化function props
  // 将传给子组件的函数用useCallback包裹
  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback((pos) => {
    const minScrollY = -HEADER_HEIGHT
    const percent = Math.abs(pos.y / minScrollY)
    const headerDom = headerEl.current
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style['theme-color']
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
      setTitle(currentAlbum.name)
      setIsMarquee(true)
    } else {
      headerDom.style.backgroundColor = ''
      headerDom.style.opacity = 1
      setTitle('歌单')
      setIsMarquee(false)
    }
  }, [currentAlbum])

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className='background'>
          <div className='filter' />
        </div>
        <div className='img_wrapper'>
          <div className='decorate'>{' '}</div>
          <img src={currentAlbum.coverImgUrl} alt='' />
          <div className='play_count'>
            <i className='iconfont play'>&#xe885;</i>
            <span className='count'>{getCount(currentAlbum.subscribedCount)}</span>
          </div>
        </div>
        <div className='desc_wrapper'>
          <div className='title'>{currentAlbum.name}</div>
          <div className='person'>
            <div className='avatar'>
              <img src={currentAlbum.creator.avatarUrl} alt='' />
            </div>
            <div className='name'>{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className='iconfont'>&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className='iconfont'>&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className='iconfont'>&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className='iconfont'>&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }

  // 在退出动画执行结束时跳转路由
  // onExited={props.history.goBack}
  // onExited={() => props.history.goBack()}
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames='fly'
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header ref={headerEl} title={title} isMarquee={isMarquee} handleClick={handleBack} />
        {/* 布局代码 */}
        {
          !isEmptyObject(currentAlbum) ? (
            <Scroll bounceTop={false} onScroll={handleScroll}>
              <div>
                {renderTopDesc()}
                {renderMenu()}
                {/* showCollect={true} 标准为如下 */}
                <SongsList
                  songs={currentAlbum.tracks}
                  showCollect
                  collectCount={currentAlbum.subscribedCount}
                  showBackground={true}
                  musicAnimation={musicAnimation}
                />
              </div>
            </Scroll>
          ) : null
        }
        {enterLoading ? <Loading /> : null}
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading'])
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch (id) {
      dispatch(actionCreators.changeEnterLoading(true))
      dispatch(actionCreators.getAlbumList(id))
    }
  }
}

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))
