import React, { useState, useEffect } from 'react'
import { SliderContainer } from './style'
import 'swiper/css/swiper.css'
import Swiper from 'swiper'

function Slider (props) {
  const [sliderSwiper, setSliderSwiper] = useState(null)
  const { bannerList } = props

  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      const sliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: true,
        autoplayDisableOnInteraction: false,
        pagination: {
          el: '.swiper-pagination'
        }
      })

      setSliderSwiper(sliderSwiper)
    }
  }, [bannerList.length, sliderSwiper])

  return (
    <SliderContainer>
      {/* 为了解决多出显示的效果，轮播图一半融合 */}
      {/* div 标签内部为空  为了报错标准语法 加入空字符串 */}
      {/* https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md */}
      <div className='before'>{' '}</div>
      <div className='slider-container'>
        <div className='swiper-wrapper'>
          {
            bannerList.map((slider, index) => {
              return (
                <div className='swiper-slide' key={slider.imageUrl + index}>
                  <div className='slider-nav'>
                    <img src={slider.imageUrl} width='100%' height='100%' alt='推荐' />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='swiper-pagination'>{' '}</div>
      </div>
    </SliderContainer>
  )
}

export default React.memo(Slider)
