import { getRankListRequest } from '../../../api/request'
import { fromJS } from 'immutable'

// constants
export const CHANGE_RANK_LIST = 'rank/CHANGE_RANK_LIST'
export const CHANGE_ENTER_LOADING = 'rank/ENTER_LOADING'

// reducer
const defaultState = fromJS({
  rankList: [],
  enterLoading: true
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      return state.set('rankList', action.data)
    case CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}

// actionCreators
export const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
})

// 加载排行榜数据
export const getRankList = () => {
  return (dispatch) => {
    getRankListRequest().then(res => {
      console.log(res)
      const data = res && res.list
      dispatch(changeRankList(data))
      dispatch(changeEnterLoading(false))
    }).catch(() => {
      console.log('排行榜数据获取失败')
    })
  }
}

export {
  reducer
}
