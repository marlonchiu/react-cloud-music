import React, { useState } from 'react'
import { Container } from './style'
import { CSSTransition } from 'react-transition-group'

function Album (props) {
  const [showStatus, setShowStatus] = useState(true)

  return (
    <CSSTransition
      in={showStatus}  
      timeout={300}
      appear={true}
      classNames='fly'
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>Album</Container>
    </CSSTransition>
  )
}

export default React.memo(Album)
