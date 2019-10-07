import React from 'react'
import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style'
import { renderRoutes } from 'react-router-config'
import routes from './routes/index'
import { HashRouter } from 'react-router-dom'

function App () {
  return (
    <HashRouter>
      <GlobalStyle />
      <IconStyle />
      {renderRoutes(routes)}
    </HashRouter>
  )
}

export default App
