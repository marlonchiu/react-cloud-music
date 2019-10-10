# 歌单详情模块开发

## 本章的内容大纲

* 1.切页动画开发
* 2.静态模板开发
* 3.数据层开发
* 4.代码封装及优化
* 5.组件复用:榜单详情开发

## 切页动画开发

### 构建路由跳转

* react中配置子路由使用的是`routes`属性；

* List组件作为Recommend的子组件，并不能从props拿到history变量，无法跳转路由；将List组件用withRouter包裹

  ```javascript
  // list/index.js
  import { withRouter } from 'react-router-dom';
  
  //省略组件代码
  
  //包裹
  export default React.memo(withRouter(RecommendList))
  ```

* 路由配置原理，具体来说就是`renderRoutes`方法。这个方法中传入参数为路由配置数组，我们在组件中调用这个方法后只能渲染一层路由，再深层的路由就无法渲染。

  ```javascript
  // src\application\Recommend\index.js
  
  import { renderRoutes } from 'react-router-config'
  
  // 返回的JSX
  <Content>
    // 其他代码
    // 将目前所在路由的下一层子路由加以渲染
    {renderRoutes(props.route.routes)}
  </Content>
  ```

## 滑动时Header联动效果

* `header/index.js`

  ```javascript
  // src\baseUI\header\index.js
  
  import React from 'react'
  import styled from 'styled-components'
  import style from '../../assets/global-style'
  import PropTypes from 'prop-types'
  
  const HeaderContainer = styled.div`
    position: fixed;
    padding: 5px 10px;
    padding-top: 0;
    height: 40px;
    width: 100%;
    z-index: 100;
    display: flex;
    line-height: 40px;
    color: ${style['font-color-light']};
    .back{
      margin-right: 5px;
      font-size: 20px;
      width: 20px;
    }
    >h1{
      font-size: ${style['font-size-l']};
      font-weight: 700;
    }
  `
  
  // 处理函数组件拿不到ref的问题,所以用forwardRef
  const Header = React.forwardRef((props, ref) => {
    const { handleClick, title, isMarquee } = props
  
    return (
      <HeaderContainer ref={ref}>
        <i className='iconfont back' onClick={handleClick}>&#xe655;</i>
        {
          // eslint-disable-next-line
          isMarquee ? <marquee><h1>{title}</h1></marquee> : <h1>{title}</h1>
        }
      </HeaderContainer>
    )
  })
  
  Header.defaultProps = {
    handleClick: () => {},
    title: '标题',
    isMarquee: false
  }
  
  Header.propTypes = {
    handleClick: PropTypes.func,
    title: PropTypes.string,
    isMarquee: PropTypes.bool
  }
  
  export default React.memo(Header)
  
  ```

* `src\application\Album\index.js`

  ```javascript
  // src\application\Album\index.js
  import React, { useState, useCallback, useRef } from 'react'
  import { HEADER_HEIGHT } from './../../api/config'
  import style from '../../assets/global-style'
  
  
    const [showStatus, setShowStatus] = useState(true)
    const [title, setTitle] = useState('歌单')
    // 是否跑马灯
    const [isMarquee, setIsMarquee] = useState(false)
  
    const headerEl = useRef()
  
    // Header组件传参
    <Header ref={headerEl} title={title} isMarquee={isMarquee} handleClick={handleBack} />
  
    const handleScroll = (pos) => {
      const minScrollY = -HEADER_HEIGHT
      const percent = Math.abs(pos.y / minScrollY)
      const headerDom = headerEl.current
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style['theme-color']
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2)
        setTitle(currentAlbum.name)
        setIsMarquee(true)
      } else {
        headerDom.style.backgroundColor = ''
        headerDom.style.opacity = 1
        setTitle('歌单')
        setIsMarquee(false)
      }
    }
  
  ```

## 代码封装及优化

### `useCallback`优化function props

将传给子组件的函数用`useCallback`包裹, 这也是`useCallback`的常用场景。

```javascript
const handleBack = useCallback(() => {
  setShowStatus(false)
}, []);

const handleScroll = useCallback((pos) => {
  //xxx
}, [currentAlbum])
```

以此为例，如果不用useCallback包裹，父组件每次执行时会生成不一样的handleBack和handleScroll函数引用，那么子组件每一次memo的结果都会不一样，导致不必要的重新渲染，也就浪费了memo的价值。

因此`useCallback`能够帮我们在依赖不变的情况保持一样的函数引用，最大程度地节约浏览器渲染性能。
