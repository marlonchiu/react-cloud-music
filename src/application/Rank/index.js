import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getRankList } from './store/index'

function Rank (props) {
  const { getRankListDataDispatch } = props

  useEffect(() => {
    getRankListDataDispatch()
    // eslint-disable-next-line
  }, [])

  return (
    <div>Rank</div>
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
