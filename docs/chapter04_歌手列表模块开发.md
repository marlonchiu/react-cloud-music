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
  type: actionTypes.CHANGE_ENTER_LOADING,
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
