# 歌手列表模块开发

## 歌手列表模块业务点规划

* 1.横向滑动分类列表开发
* 2.歌手列表开发
* 3.数据层开发
* 4.加载更多功能
* 5.部分优化

## 横向滑动分类列表开发

* 数据显示
* **解决滚动问题**(重点关注如何实现)

* `Singers/index.js`代码

  ```javascript
  import React, { useState } from 'react'
  import Horizen from '../../baseUI/horizen-item'
  import { categoryTypes, alphaTypes } from '../../api/config'
  import { NavContainer } from './style'
  
  function Singers (props) {
    const [category, setCategory] = useState('')
    const [alpha, setAlpha] = useState('')
  
    const handleUpdateCatetory = (val) => {
      setCategory(val)
    }
    const handleUpdateAlpha = (val) => {
      setAlpha(val)
    }
  
    return (
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
    )
  }
  
  export default React.memo(Singers)
  
  ```

* `...\src\baseUI\horizen-item\index.js`代码

  ```javascript
  import React, { useRef, useEffect, memo } from 'react'
  import Scroll from '../scroll/index'
  import styled from 'styled-components'
  import { PropTypes } from 'prop-types'
  import style from '../../assets/global-style'
  
  const List = styled.div`
    display: flex;
    align-items: center;
    height: 30px;
    overflow: hidden;
    >span:first-of-type{
      display: block;
      flex: 0 0 auto;
      padding: 5px 0;
      margin-right: 5px;
      color: grey;
      font-size: ${style['font-size-m']};
      vertical-align: middle;
    }
  `
  
  const ListItem = styled.span`
    flex: 0 0 auto;
    font-size: ${style['font-size-m']};
    padding: 5px 8px;
    border-radius: 10px;
    &.selected{
      color: ${style['theme-color']};
      border: 1px solid ${style['theme-color']};
      opacity: 0.8;
    }
  `
  
  function Horizen (props) {
    // 加入声明
    const Category = useRef(null)
  
    const { list, oldVal, title } = props
    const { handleClick } = props
  
    // 加入初始化内容宽度的逻辑(动态计算宽度然后才可以滚动)
    useEffect(() => {
      const categoryDOM = Category.current
      const tagElems = categoryDOM.querySelectorAll('span')
      let totalWidth = 0
      Array.from(tagElems).forEach(ele => {
        totalWidth += ele.offsetWidth
      })
      categoryDOM.style.width = `${totalWidth}px`
      // eslint-disable-next-line
    }, [])
  
    return (
      <Scroll direction='horizental'>
        <div ref={Category}>
          <List>
            <span>{title}</span>
            {
              list.map((item) => {
                return (
                  <ListItem
                    key={item.key}
                    className={`${oldVal === item.key ? 'selected' : ''}`}
                    onClick={() => handleClick(item.key)}
                  >
                    {item.name}
                  </ListItem>
                )
              })
            }
          </List>
        </div>
      </Scroll>
    )
  }
  
  // 首先考虑接受的参数
  // list为接受的列表数据
  // oldVal为当前的item值
  // title为列表左边的标题
  // handleClick为点击不同的item执行的方法
  Horizen.defaultProps = {
    list: [],
    oldVal: '',
    title: '',
    handleClick: null
  }
  
  Horizen.propTypes = {
    list: PropTypes.array,
    oldVal: PropTypes.string,
    title: PropTypes.string,
    handleClick: PropTypes.func
  }
  
  export default memo(Horizen)
  
  ```

## 歌手列表开发布局

此模块的静态布局较为简单，建立在前边开发的基础上

## Redux数据层开发（步骤）

### 准备工作

在Singers目录下，新建store文件夹，然后新建以下文件:

```text
actionCreators.js //放不同action的地方
constants.js      //常量集合，存放不同action的type值
index.js          //用来导出reducer，action
reducer.js        //存放initialState和reducer函数
```

准备接口

```javascript
// src/api/request.js

// 获取热门歌手数据
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

// 获取歌手分类列表数据
export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`)
}
```

### 声明初始化state

初始化state在reducer中进行

```javascript
// store/reducer.js  存放initialState和reducer函数

import { fromJS } from 'immutable'

const defaultState = fromJS({
  singerList: [],
  enterLoading: true,
  pullUpLoading: false, // 控制上拉加载动画
  pullDownLoading: false, // 控制下拉加载动画
  pageCount: 0 // 这里是当前页数，我们即将实现分页功能
})
```

### 定义constants

```javascript
// store/constants.js
export const CHANGE_SINGER_LIST = 'singers/CHANGE_SINGER_LIST'

export const CHANGE_PAGE_COUNT = 'singers/PAGE_COUNT'

export const CHANGE_ENTER_LOADING = 'singers/ENTER_LOADING'

export const CHANGE_PULLUP_LOADING = 'singers/PULLUP_LOADING'

export const CHANGE_PULLDOWN_LOADING = 'singers/PULLDOWN_LOADING'

```

### 定义reducer函数

在reducer.js文件中加入以下处理逻辑，由于存放的是immutable数据结构，所以必须用set方法来设置新状态，同时取状态用get方法。

```javascript
// store/reducer.js
import * as actionTypes from './constants'

// ..............................

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    case actionTypes.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data)
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data)
    case actionTypes.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data)
    default:
      return state
  }
}

```

### 编写具体的action

首先定义所需要的action（同步操作），调用接口获取数据后修改action

```javascript
// store/actionCreators.js // 放不同action的地方

import * as actionTypes from './constants'
import { fromJS } from 'immutable'
import { getHotSingerListRequest, getSingerListRequest } from '../../../api/request'

export const changeSingerList = (data) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data: fromJS(data)
})

export const changePageCount = (data) => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data: fromJS(data)
})

// 进场loading
export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

// 滑动最底部加载更多loading
export const changePullUpLoading = (data) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data
})

// 顶部下拉刷新loading
export const changePullDownLoading = (data) => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data
})

// 第一次加载热门歌手
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
      console.log(res)
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(() => {
      console.log('热门歌手数据获取失败')
    })
  }
}

// 加载更多热门歌手
export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState().getIn(['singers', 'singerList']).toJS()

    getHotSingerListRequest(pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(() => {
      console.log('热门歌手数据获取失败')
    })
  }
}

// 第一次加载对应类别的歌手
export const getSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(category, alpha, 0).then(res => {
      console.log(res)
      const data = res.artists
      dispatch(changeSingerList(data))
      dispatch(changeEnterLoading(false))
      dispatch(changePullDownLoading(false))
    }).catch(() => {
      console.log('歌手列表数据获取失败')
    })
  }
}

// 加载更多歌手
export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState().getIn(['singers', 'singerList']).toJS()

    getSingerListRequest(category, alpha, pageCount).then(res => {
      const data = [...singerList, ...res.artists]
      dispatch(changeSingerList(data))
      dispatch(changePullUpLoading(false))
    }).catch(() => {
      console.log('歌手列表数据获取失败')
    })
  }
}

```

### 将相关变量导出

```javascript
// store/index.js

import reducer from './reducer'
import * as actionCreators from './actionCreators'

export {
  reducer,
  actionCreators
}

```

### 将Singers下的reducer注册到全局store

将Singers下的reducer注册到全局store，在src目录下的store/reducer.js中，内容如下:

```javascript
// src/store/reducer.js
import { combineReducers } from 'redux-immutable'
import { reducer as recommendReducer } from '../application/Recommend/store/index'
// +++++++++++
import { reducer as singersReducer } from '../application/Singers/store/index'

export default combineReducers({
  // 之后开发具体功能模块的时候添加reducer
  recommend: recommendReducer,
  // +++++++++++
  singers: singersReducer
})

```

## Singers组件连接Redux数据

```javascript
import React, { useState, useEffect } from 'react'

// 。。。。。。。。。。。。。。。。。。。。。。。第一步。。。。。。。。。。。。。。。。。
import { connect } from 'react-redux'
import * as actionCreators from './store/actionCreators'

function Singers (props) {
  const [category, setCategory] = useState('')
  const [alpha, setAlpha] = useState('')
  
 // 。。。。。。。。。。。。。。。。。。。。。。。第四步。。。。。。。。。。。。。。。。。
  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = props
  const { getHotSingerListDataDispatch, getSingerListDataDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props

  // 。。。。。。。。。。。。。。。。。。。。。。。第五步。。。。。。。。。。。。。。。。。
  useEffect(() => {
    getHotSingerListDataDispatch()
    // eslint-disable-next-line
  }, [])

  const handleUpdateCatetory = (val) => {
    setCategory(val)
    getSingerListDataDispatch(category, val)
  }
  const handleUpdateAlpha = (val) => {
    setAlpha(val)
    getSingerListDataDispatch(category, val)
  }

  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    // 。。。。。。。。。。。。。。。。。。。。。。。第六步。。。。。。。。。。。。。。。。。
    const singerListJS = singerList ? singerList.toJS() : []
    // console.log(singerListJS)

    return (
      <List>
        {
          singerListJS.map((item, index) => {
            return (
              <ListItem key={item.accountId + '-' + index}>
                <div className='img_wrapper'>
                  <img src={item.picUrl + '?param=300x300'} width='100%' height='100%' alt='music' />
                </div>
                <span className='name'>{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  }

}

// 。。。。。。。。。。。。。。。。。。。。。。。第二步。。。。。。。。。。。。。。。。。

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

// 。。。。。。。。。。。。。。。。。。。。。。。第三步。。。。。。。。。。。。。。。。。
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))

```

## 上拉/下拉加载更多实现

* `\baseUI\scroll\index.js`组件引入loading模块

  ```javascript
  // ....\src\baseUI\scroll\index.js
  
  import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react'
  import PropTypes from 'prop-types'
  import BScroll from 'better-scroll'
  import styled from 'styled-components'
  import Loading from '../loading'
  import LoadingV2 from '../loading-v2'
  
  const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
  `
  
  const PullUpLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    width: 60px;
    height: 60px;
    margin: auto;
    z-index: 100;
  `
  
  export const PullDownLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0px;
    height: 30px;
    margin: auto;
    z-index: 100;
  `
  
  const Scroll = forwardRef((props, ref) => {
    // better-scroll实例对象
    const [bScroll, setBScroll] = useState()
  
    // current指向初始化bs实例需要的DOM元素
    const scrollContaninerRef = useRef()
  
    const { direction, click, refresh, bounceTop, bounceBottom } = props
    const { pullUp, pullDown, onScroll, pullUpLoading, pullDownLoading } = props
  
    // 创建better-scroll
    useEffect(() => {
      const scroll = new BScroll(scrollContaninerRef.current, {
        scrollX: direction === 'horizental',
        scrollY: direction === 'vertical',
        probeType: 3,
        click: click,
        bounce: {
          top: bounceTop,
          bottom: bounceBottom
        }
      })
  
      setBScroll(scroll)
      return () => {
        setBScroll(null)
      }
      // eslint-disable-next-line
    }, [])
  
    // 给实例绑定scroll事件
    useEffect(() => {
      if (!bScroll || !onScroll) return
      bScroll.on('scroll', (scroll) => {
        onScroll(scroll)
      })
      return () => {
        bScroll.off('scroll')
      }
    }, [onScroll, bScroll])
  
    // 每次重新渲染都要刷新实例，防止无法滑动
    useEffect(() => {
      if (refresh && bScroll) {
        bScroll.refresh()
      }
    })
    // 进行上拉到底的判断，调用上拉刷新的函数
    useEffect(() => {
      if (!bScroll || !pullUp) return
      bScroll.on('scrollEnd', () => {
        // 判断是否滑动到了底部
        if (bScroll.y <= bScroll.maxScrollY + 100) {
          pullUp()
        }
      })
      return () => {
        bScroll.off('scrollEnd')
      }
    }, [pullUp, bScroll])
  
    // 进行下拉的判断，调用下拉刷新的函数
    useEffect(() => {
      if (!bScroll || !pullDown) return
      bScroll.on('touchEnd', (pos) => {
        // 判断用户的下拉动作
        if (pos.y > 50) {
          pullDown()
        }
      })
      return () => {
        bScroll.off('touchEnd')
      }
    }, [pullDown, bScroll])
  
    // 一般和forwardRef一起使用，ref已经在forWardRef中默认传入
    useImperativeHandle(ref, () => ({
      // 给外界暴露refresh方法
      refresh () {
        if (bScroll) {
          bScroll.refresh()
          bScroll.scrollTo(0, 0)
        }
      },
      // 给外界暴露getBScroll方法, 提供bs实例
      getBScroll () {
        if (bScroll) {
          return bScroll
        }
      }
    }))
  
    const PullUpDisplayStyle = pullUpLoading ? { display: '' } : { display: 'none' }
    const PullDownDisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' }
  
    return (
      <ScrollContainer ref={scrollContaninerRef}>
        {props.children}
        {/* 滑到底部加载动画 */}
        <PullUpLoading style={PullUpDisplayStyle}><Loading /></PullUpLoading>
        {/* 顶部下拉刷新动画 */}
        <PullDownLoading style={PullDownDisplayStyle}><LoadingV2 /></PullDownLoading>
      </ScrollContainer>
    )
  })
  
  Scroll.defaultProps = {
    direction: 'vertical',
    click: true,
    refresh: true,
    onScroll: null,
    pullUp: null,
    pullDown: null,
    pullUpLoading: false,
    pullDownLoading: false,
    bounceTop: true,
    bounceBottom: true
  }
  
  Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizental']), // 滚动的方向
    click: PropTypes.bool, // 是否支持点击
    refresh: PropTypes.bool, // 是否刷新
    onScroll: PropTypes.func, // 滑动触发的回调函数
    pullUp: PropTypes.func, // 上拉加载逻辑
    pullDown: PropTypes.func, // 下拉加载逻辑
    pullUpLoading: PropTypes.bool, // 是否显示上拉loading动画
    pullDownLoading: PropTypes.bool, // 是否显示下拉loading动画
    bounceTop: PropTypes.bool, // 是否支持向上吸顶
    bounceBottom: PropTypes.bool // 是否支持向下吸底
  }
  
  export default Scroll
  
  ```

* 修改基础组件`loading`和增加基础组件`loading-v2`，看代码
