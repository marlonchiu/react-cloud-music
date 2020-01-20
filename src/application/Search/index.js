import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'
import { CSSTransition } from 'react-transition-group'
import { Container, ShortcutWrapper, HotKey } from './style'
import SearchBox from './../../baseUI/search-box/index'
import Scroll from './../../baseUI/scroll'

function Search (props) {
  // 控制动画
  const [show, setShow] = useState(false)
  // 搜索框初始值
  const [query, setQuery] = useState('')

  const {
    hotList,
    suggestList: immutableSuggestList,
    songsCount,
    songsList: immutableSongsList,
    enterLoading
  } = props
  const { getHotKeyWordsDispatch, getSuggestListDispatch, changeEnterLoadingDispatch } = props
  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS()

  // 显示搜索页面
  useEffect (() => {
    setShow(true)
  }, [])

  // 由于是传给子组件的方法，尽量用 useCallback 包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
  const searchBack = useCallback(() => {
    setShow(false)
  }, [])

  const handleQuery = (q) => {
    console.log(q)
    setQuery(q)
  }

  return (
    <CSSTransition
    in={show}
    timeout={300}
    appear={true}
    classNames='fly'
    unmountOnExit
    onExited={() => props.history.goBack ()}
    >
      <Container>
        <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery} />
      </Container>
  </CSSTransition>
  )
}
// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  hotList: state.getIn(['search', 'hotList']),
  suggestList: state.getIn(['search', 'suggestList']),
  songsList: state.getIn(['search', 'songsList']),
  songsCount: state.getIn(['player', 'playList']).size,
  enterLoading: state.getIn(['search', 'enterLoading'])
})

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch () {
      dispatch(actionCreators.getHotKeyWords())
    },
    getSuggestListDispatch (data) {
      dispatch(actionCreators.getSuggestList(data))
    },
    changeEnterLoadingDispatch (data) {
      dispatch(actionCreators.changeEnterLoading(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search))
