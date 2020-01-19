import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import Slider from '../../components/slider'
import RecommendList from '../../components/list'
import Scroll from '../../baseUI/scroll/index'
import { Content } from './style'
import { forceCheck } from 'react-lazyload'
import Loading from '../../baseUI/loading/index'
import { renderRoutes } from 'react-router-config'

function Recommend (props) {
  // mock数据
  // const bannerList = [1, 2, 3, 4].map(item => {
  //   return { imageUrl: 'http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg' }
  // })

  // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(item => {
  //   return {
  //     id: 1,
  //     picUrl: 'https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg',
  //     playCount: 17171122,
  //     name: '朴树、许巍、李健、郑钧、老狼、赵雷'
  //   }
  // })

  const { bannerList, recommendList, enterLoading, songsCount } = props
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props
  useEffect(() => {
    // 如果页面有数据，则不发请求
    // immutable数据结构中长度属性size（数据缓存优化）
    if (!bannerList.size) getBannerDataDispatch()
    if (!recommendList.size) getRecommendListDataDispatch()
    // eslint-disable-next-line
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []

  return (
    <Content play={songsCount}>
      <Scroll className='list' onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      {enterLoading ? <Loading /> : null}
      {/* 将目前所在路由的下一层子路由加以渲染 */}
      {renderRoutes(props.route.routes)}
    </Content>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // 不要再这里将数据toJS,不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染, 属于滥用immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size // 尽量减少toJS操作，直接取size属性就代表了list的长度
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch () {
      dispatch(actionCreators.getBannerList())
    },
    getRecommendListDataDispatch () {
      dispatch(actionCreators.getRecommendList())
    }
  }
}

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))
