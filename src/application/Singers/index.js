import React, { useEffect, useContext } from 'react'
import Horizen from '../../baseUI/horizen-item'
import { categoryTypes, alphaTypes } from '../../api/config'
import { NavContainer, ListContainer, List, ListItem } from './style'
import Scroll from '../../baseUI/scroll/index'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import Loading from '../../baseUI/loading/index'
import LazyLoad, { forceCheck } from 'react-lazyload'
import { CategoryDataContext, CHANGE_CATEGORY, CHANGE_ALPHA, CategoryData } from './data'
import { renderRoutes } from 'react-router-config'
// mock数据
// const singerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(item => {
//   return {
//     picUrl: 'https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg',
//     name: '隔壁老樊',
//     accountId: 277313426,
//   }
// })

function Singers (props) {
  // const [category, setCategory] = useState('')
  // const [alpha, setAlpha] = useState('')
  // 将之前的useState代码删除
  const { data, dispatch } = useContext(CategoryDataContext)
  // 拿到category和alpha的值
  const { category, alpha } = data.toJS()

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props
  const { getHotSingerListDataDispatch, getSingerListDataDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props

  useEffect(() => {
    // 歌手列表页的数据缓存
    if (!singerList.size) getHotSingerListDataDispatch()
    // eslint-disable-next-line
  }, [])

  // CHANGE_ALPHA和CHANGE_CATEGORY变量需要从data.js中引入
  const handleUpdateCatetory = (val) => {
    // setCategory(val)
    dispatch({ type: CHANGE_CATEGORY, data: val })
    getSingerListDataDispatch(val, alpha)
  }
  const handleUpdateAlpha = (val) => {
    // setAlpha(val)
    dispatch({ type: CHANGE_ALPHA, data: val })
    getSingerListDataDispatch(category, val)
  }
  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount)
  }
  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }

  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`)
  }

  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    const singerListJS = singerList ? singerList.toJS() : []
    // console.log(singerListJS)
    // console.log(props)
    return (
      <List>
        {
          singerListJS.map((item, index) => {
            return (
              <ListItem key={item.accountId + '-' + index} onClick={() => enterDetail(item.id)}>
                <div className='img_wrapper'>
                  <LazyLoad placeholder={<img width='100%' height='100%' src={require('./singer.png')} alt='singer' />}>
                    <img src={`${item.picUrl}?param=300x300`} width='100%' height='100%' alt='singer' />
                  </LazyLoad>
                </div>
                <span className='name'>{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  return (
    <div>
      <CategoryData>
        <NavContainer>
          <Horizen
            list={categoryTypes}
            title={'分类（默认热门）:'}
            oldVal={category}
            handleClick={(val) => handleUpdateCatetory(val)}
          />
          <Horizen
            list={alphaTypes}
            title='首字母:'
            oldVal={alpha}
            handleClick={(val) => handleUpdateAlpha(val)}
          />
        </NavContainer>
        <ListContainer>
          <Scroll
            onScroll={forceCheck}
            pullUp={handlePullUp}
            pullDown={handlePullDown}
            pullUpLoading={pullUpLoading}
            pullDownLoading={pullDownLoading}
          >
            {renderSingerList()}
          </Scroll>
          <Loading show={enterLoading} />
        </ListContainer>
      </CategoryData>
      {renderRoutes(props.route.routes)}
    </div>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    // 热门歌手数据
    getHotSingerListDataDispatch () {
      dispatch(actionCreators.getHotSingerList())
    },
    // 歌手列表数据
    getSingerListDataDispatch (category, alpha) {
      // 由于改变了分类，所以pageCount清零
      dispatch(actionCreators.changePageCount(0))
      // loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
      dispatch(actionCreators.changeEnterLoading(true))
      dispatch(actionCreators.getSingerList(category, alpha))
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch (category, alpha, hot, count) {
      dispatch(actionCreators.changePullUpLoading(true))
      dispatch(actionCreators.changePageCount(count + 1))
      if (hot) {
        dispatch(actionCreators.refreshMoreHotSingerList())
      } else {
        dispatch(actionCreators.refreshMoreSingerList(category, alpha))
      }
    },
    // 顶部下拉刷新
    pullDownRefreshDispatch (category, alpha) {
      dispatch(actionCreators.changePullDownLoading(true))
      dispatch(actionCreators.changePageCount(0)) // 属于重新获取数据
      if (category === '' && alpha === '') {
        dispatch(actionCreators.getHotSingerList())
      } else {
        dispatch(actionCreators.getSingerList(category, alpha))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))
