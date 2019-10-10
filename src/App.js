import React from 'react'
import { Provider } from 'react-redux'
import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style'
import { renderRoutes } from 'react-router-config'
import routes from './routes/index'
import store from './store/index'
import { HashRouter } from 'react-router-dom'
// 引入singers的hooks状态提供器
import { CategoryData } from './application/Singers/data'
function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle />
        <IconStyle />
        {/* singers提供状态 */}
        <CategoryData>
          {renderRoutes(routes)}
        </CategoryData>
      </HashRouter>
    </Provider>
  )
}

export default App
