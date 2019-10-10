import React, { useState } from 'react'
import { Container } from './style'
import { CSSTransition } from 'react-transition-group'
import Header from '../../baseUI/header/index'

function Album (props) {
  const [showStatus, setShowStatus] = useState(true)

  const handleBack = () => {
    setShowStatus(false)
  }

  // 在退出动画执行结束时跳转路由
  // onExited={props.history.goBack}
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames='fly'
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header title='返回' handleClick={handleBack} />
      </Container>
    </CSSTransition>
  )
}

export default React.memo(Album)
