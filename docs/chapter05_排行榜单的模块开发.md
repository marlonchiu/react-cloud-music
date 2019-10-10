# 排行榜单的模块开发

## 本章功能处理

* 上一章思考题探讨（切换tab 保存上一次选择的分类和歌手）
* Rank组件模块数据层处理
* Rank组件UI层开发
* 性能优化

## 思考题探索

* 全局的状态管理不仅仅可以用redux，react hooks同样可以模拟出这种功能。现在我们就用hooks中的useContext结合useReducer打造出类似redux的状态管理功能。

* 用hooks写一个简单的redux，`data.js`代码

  ```javascript
  // ...\src\application\Singers\data.js
  
  // 模拟一个简单的redux，保存singers组建的状态
  // https://sanyuan0704.github.io/react-cloud-music/chapter5/hooks.html
  import React, { createContext, useReducer } from 'react'
  import { fromJS } from 'immutable'
  
  // context
  export const CategoryDataContext = createContext({})
  
  // 相当于之前的constants
  export const CHANGE_CATEGORY = 'singers/CHANGE_CATEGORY'
  export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA'
  
  // reducer纯函数
  const reducer = (state, action) => {
    switch (action.type) {
      case CHANGE_CATEGORY:
        return state.set('category', action.data)
      case CHANGE_ALPHA:
        return state.set('alpha', action.data)
      default:
        return state
    }
  }
  
  // Provider组件
  export const CategoryData = (props) => {
    // useReducer的第二个参数中传入初始值
    const [data, dispatch] = useReducer(reducer, fromJS({
      category: '',
      alpha: ''
    }))
  
    return (
      <CategoryDataContext.Provider value={{ data, dispatch }}>
        {props.children}
      </CategoryDataContext.Provider>
    )
  }
  
  ```

* 在App.js中用Data这个Provider组件来包裹下面的子组件

  ```javascript
  // src/App.js
  
  // 引入singers的hooks状态提供器
  import { CategoryData } from './application/Singers/data'
  
  function App () {
    return (
      <Provider store={store}>
        <HashRouter>
          <GlobalStyle />
          <IconStyle />
          {/* singers提供状态 */}
          <CategoryData>
            {renderRoutes(routes)}
          </CategoryData>
        </HashRouter>
      </Provider>
    )
  }
  
  export default App
  ```

* `Singers/index.js`来运用

  ```javascript
  // ...\src\application\Singers\index.js
  
  // 首先需要引入useContext 将之前的useState代码删除
  import { CategoryDataContext, CHANGE_CATEGORY, CHANGE_ALPHA, CategoryData } from './data'
  
  function Singers (props) {
    // const [category, setCategory] = useState('')
    // const [alpha, setAlpha] = useState('')
    // 将之前的useState代码删除
    const { data, dispatch } = useContext(CategoryDataContext)
    // 拿到category和alpha的值
    const { category, alpha } = data.toJS()
  
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
      </div>
    )
  }
  
  ```

## hooks现在不就可以取代redux吗？

现在的确也有不少人这样说，尽管hooks能模拟redux的核心功能，但是能够取代redux这件事我不敢苟同。

1. 首先redux有非常成熟的状态跟踪调试工具，也就是chrome浏览器的redux-devtools插件，至少到现在为止开发中很多的错误我都是通过它发现的。换而言之，它能够协助我们写出更利于维护的代码，并且在出现故障时快速找到问题的根源。
2. 其次，redux有非常成熟的数据模块化方案，不同模块的reducer直接导出，在全局的store中，调一下redux自带的combineReducer即可，目前从官方的角度看hooks这方面并不成熟。
3. Redux拥有成熟且强大的中间件功能，如redux-logger, redux-thunk, redux-saga，用hooks实现中间件的功能就只能靠自己手撸啦。

当然redux也并不是十全十美的，有些方面也经常被人吐槽，比如繁重的模板代码，需要react-redux引入徒增项目包大小等等。但是瑕不掩瑜，这些不妨碍我们使用redux开发出容易调试并维护的应用。
因此我觉得redux是一个短时间不可被替代的状态管理方案。
