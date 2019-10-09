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

  // 加入初始化内容宽度的逻辑
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
