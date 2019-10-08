import React from 'react'
import { Provider } from 'react-redux'
import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style'
import { renderRoutes } from 'react-router-config'
import routes from './routes/index'
import store from './store/index'
import { HashRouter } from 'react-router-dom'

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        <IconStyle />
        {renderRoutes(routes)}
      </HashRouter>
    </Provider>
  )
}

export default App
