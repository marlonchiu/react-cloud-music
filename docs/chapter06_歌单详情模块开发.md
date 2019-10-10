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
