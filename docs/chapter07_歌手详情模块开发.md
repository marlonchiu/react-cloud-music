# 歌手详情模块开发

## 歌手详情模块开发大纲

* 1.布局开发
* 2.交互逻辑开发
* 3.数据层开发

## 布局开发

### 歌曲列表组件重构（公共抽取）

推荐歌单部分，我们用到了歌曲列表，这里我们可以把这样的列表抽离出来，做一下组件的复用。

application目录下新建SongList组件(由于之后和播放器组件的数据交互较多

* `src\application\SongsList\index.js`代码

  ```javascript
  import React from 'react'
  import { SongList, SongItem } from './style'
  import { getCount, getName } from '../../api/utils'
  
  const SongsList = React.forwardRef((props, refs) => {
    const { collectCount, showCollect, songs } = props
    const totalCount = songs.length
  
    const selectItem = (e, index) => {
      console.log(index)
    }
  
    const songList = (list) => {
      let res = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        res.push(
          <li key={item.id} onClick={(e) => selectItem(e, i)}>
            <span className='index'>{i + 1}</span>
            <div className='info'>
              <span>{item.name}</span>
              <span>
                {/* {getName(item.ar)} - {item.al.name} */}
                {/* 专辑名或者歌名选一 */}
                {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
              </span>
            </div>
          </li>
        )
      }
      return res
    }
  
    const collect = (count) => {
      return (
        <div className='add_list'>
          <i className='iconfont'>&#xe62d;</i>
          {/* <span>收藏({Math.floor(count / 1000) / 10}万)</span> */}
          <span>收藏({getCount(count)})</span>
        </div>
      )
    }
  
    return (
      <SongList ref={refs} showBackground={props.showBackground}>
        <div className='first_line'>
          <div className='play_all' onClick={(e) => selectItem(e, 0)}>
            <i className='iconfont'>&#xe6e3;</i>
            <span>播放全部 <span className='sum'>(共{totalCount}首)</span></span>
          </div>
          {showCollect ? collect(collectCount) : null}
        </div>
        <SongItem>
          {songList(songs)}
        </SongItem>
      </SongList>
    )
  })
  
  export default React.memo(SongsList)
  
  ```

* `src\application\SongsList\style.js`

  ```javascript
  import styled from 'styled-components'
  import style from '../../assets/global-style'
  
  export const SongList = styled.div`
    border-radius: 10px;
    opacity: 0.98;
    /* 注意在这里背景改为自配置参数控制 */
    ${props => props.showBackground ? `background: ${style['highlight-background-color']}` : ''}
    .first_line {
      box-sizing: border-box;
      padding: 10px 0;
      margin-left: 10px;
      position: relative;
      justify-content: space-between;
      border-bottom: 1px solid ${style['border-color']};
      .play_all {
        display: inline-block;
        line-height: 24px;
        color: ${style['font-color-desc']};
        .iconfont {
          font-size: 24px;
          margin-right: 10px;
          vertical-align: top;
        }
        .sum {
          font-size: ${style['font-size-s']};
          color: ${style['font-color-desc-v2']};
        }
        >span {
          vertical-align: top;
        }
      }
      .add_list,.isCollected {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        top :0;
        bottom: 0;
        width: 130px;
        line-height: 34px;
        background: ${style['theme-color']};
        color: ${style['font-color-light']};
        font-size: 0;
        border-radius: 3px;
        vertical-align: top;
        .iconfont {
          vertical-align: top;
          font-size: 10px;
          margin: 0 5px 0 10px;
        }
        span{
          font-size: 14px;
          line-height: 34px;
        }
      }
      .isCollected {
        display: flex;
        background: ${style['background-color']};
        color: ${style['font-color-desc']};
      }
  }
  `
  
  export const SongItem = styled.ul`
    >li {
      display: flex;
      height: 60px;
      align-items: center;  
      .index {
        flex-basis: 60px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }
      .info {
        box-sizing: border-box;
        flex: 1;
        display: flex;
        height: 100%;
        padding: 5px 0;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px solid ${style['border-color']};
        ${style.noWrap()}
        >span{
          ${style.noWrap()}
        }
        >span:first-child{
          color: ${style['font-color-desc']};
        }
        >span:last-child{
          font-size: ${style['font-size-s']};
          color: #bba8a8;
        }
      }
    }
  `
  
  ```

* 动态计算歌单类表的初始位置

  ```javascript
  // src\application\Singer\index.js  
  
    const collectButton = useRef()
    const imageWrapper = useRef()
    const songScrollWrapper = useRef()
    const songScroll = useRef()
    const header = useRef()
    const layer = useRef()
    // 图片初始高度
    const initialHeight = useRef(0)
    // 往上偏移的尺寸，露出圆角
    const OFFSET = 5
  
    useEffect(() => {
      const h = imageWrapper.current.offsetHeight
      // console.log(h)
      // 图片包裹器的定位开始top值
      songScrollWrapper.current.style.top = `${h - OFFSET}px`
      initialHeight.current = h
      // 把遮罩先放在下面，以裹住歌曲列表
      layer.current.style.top = `${h - OFFSET}px`
      songScroll.current.refresh()
      // eslint-disable-next-line
    }, [])
  
  ```

## 交互逻辑实现

主要是歌单列表上拉下拉时候的效果，滑动主要分三种情况:

1. 处理往下拉的情况,效果：图片放大，按钮跟着偏移
2. 往上滑动，但是遮罩还没超过Header部分
3. 往上滑动，但是遮罩超过Header部分

交互代码

* Scroll组件定义一个滚动的方法

  ```javascript
  <Scroll onScroll={handleScroll} ref={songScroll}>
  ```

* 滚动逻辑处理

  ```javascript
    // handleScroll作为一个传给子组件的方法，我们需要用useCallback进行包裹，防止不必要的重渲染
    const handleScroll = useCallback((pos) => {
      const height = initialHeight.current
      const newY = pos.y
      const imageDOM = imageWrapper.current
      const buttonDOM = collectButton.current
      const headerDOM = header.current
      const layerDOM = layer.current
      const minScrollY = -(height - OFFSET) + HEADER_HEIGHT
      // 指的是滑动距离占图片高度的百分比
      const percent = Math.abs(newY / height)
      // 在歌手页的布局中，歌单列表其实是没有自己的背景的，
      // layerDOM其实是起一个遮罩的作用，给歌单内容提供白色背景
      // 因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
  
      // 滑动情况一：处理往下拉的情况,效果：图片放大，按钮跟着偏移
      if (newY > 0) {
        imageDOM.style.transform = `scale(${1 + percent})`
        buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
        layerDOM.style.top = `${height - OFFSET + newY}px`
      } else if (newY >= minScrollY) { // 往上滑动，但是遮罩还没超过Header部分
        layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
        // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
        layerDOM.style.zIndex = 1
        imageDOM.style.paddingTop = '75%'
        imageDOM.style.height = 0
        imageDOM.style.zIndex = -1
        // 按钮跟着移动且渐渐变透明
        buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
        buttonDOM.style.opacity = `${1 - percent * 2}`
      } else if (newY < minScrollY) { // 往上滑动，但是遮罩超过Header部分
        // 往上滑动，但是超过Header部分
        layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
        layerDOM.style.zIndex = 1
        // 防止溢出的歌单内容遮住Header
        headerDOM.style.zIndex = 100
        // 此时图片高度与Header一致
        imageDOM.style.height = `${HEADER_HEIGHT}px`
        imageDOM.style.paddingTop = 0
        imageDOM.style.zIndex = 99
      }
    }, [])
  ```

## 数据层开发

范式操作，理清逻辑即可

注意添加loading效果