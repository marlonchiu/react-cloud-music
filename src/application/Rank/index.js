import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Container, List, ListItem, SongList } from './style'
import { getRankList } from './store/index'
import { filterIndex, filterIdx } from '../../api/utils'
import Scroll from '../../baseUI/scroll/index'
import Loading from '../../baseUI/loading'
import { EnterLoading } from './../Singers/style'
import { renderRoutes } from 'react-router-config'

function Rank (props) {
  const { rankList: list, enterLoading } = props
  const { getRankListDataDispatch } = props

  const rankList = list ? list.toJS() : []

  // 全球榜开始的索引
  const globalStartIndex = filterIndex(rankList)
  // 官方榜
  const officialList = rankList.slice(0, globalStartIndex)
  // 全球榜
  const globalList = rankList.slice(globalStartIndex)

  useEffect(() => {
    if (!rankList.length) getRankListDataDispatch()
    // eslint-disable-next-line
  }, [])

  const enterDetail = (name) => {
    const idx = filterIdx(name)
    if (idx === null) {
      alert('暂无相关数据')
      return false
    }

    // 后续跳转操作
  }

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null
  }

  // 渲染榜单列表函数，传入global变量来区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item) => {
            return (
              <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item.name)}>
                <div className='img_wrapper'>
                  <img src={item.coverImgUrl} alt='' />
                  <div className='decorate' />
                  <span className='update_frequecy'>{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  // 榜单数据未加载出来之前都给隐藏
  const LoadingDisplayStyle = enterLoading ? { display: 'none' } : { display: '' }
  return (
    <Container>
      <Scroll>
        <div>
          <h1 className='offical' style={LoadingDisplayStyle}>官方榜</h1>
          {renderRankList(officialList)}
          <h1 className='global' style={LoadingDisplayStyle}>全球榜</h1>
          {renderRankList(globalList, true)}
          {enterLoading ? <EnterLoading><Loading /></EnterLoading> : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  enterLoading: state.getIn(['rank', 'enterLoading'])
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => { 
  return {
    // 排行榜数据
    getRankListDataDispatch () {
      dispatch(getRankList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))
