import React from 'react'
import { ListWrapper, List, ListItem } from './style'
import { getCount } from '../../api/utils'

function RecommendList (props) {
  const { recommendList } = props
  return (
    <ListWrapper>
      <h1 className='title'>推荐歌单</h1>
      <List>
        {
          recommendList.map((item, index) => {
            return (
              <ListItem key={item.id + index}>
                <div className='img_wrapper'>
                  {/* 作用就是给图片上的图标和文字提供一个遮罩，因为在字体颜色是白色， */}
                  {/* 在面对白色图片背景的时候，文字会看不清或者看不到，因此提供一个阴影来衬托出文字 */}
                  <div className='decorate'>{' '}</div>
                  {/* 加此参数可以减小请求的图片资源大小 */}
                  <img src={item.picUrl + '?param=300x300'} width='100%' height='100%' alt='music' />
                  <div className='play_count'>
                    <i className='iconfont play'>&#xe885;</i>
                    <span className='count'>{getCount(item.playCount)}</span>
                  </div>
                </div>
                <div className='desc'>{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  )
}

export default React.memo(RecommendList)
