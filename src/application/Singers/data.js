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
