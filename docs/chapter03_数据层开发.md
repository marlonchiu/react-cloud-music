# 推荐模块 数据层开发（核心业务）

## 数据接口

[GitHub网易云音乐接口](https://github.com/Binaryify/NeteaseCloudMusicApi/tree/master)

按照说明clone，然后启动项目提供数据

```bash
# 服务器启动默认端口为 3000,
$ node app.js

# 若不想使用 3000 端口,可使用以下命令: Mac/Linux
$ PORT=4000 node app.js

# windows 下使用 git-bash 或者 cmder 等终端执行以下命令:
$ set PORT=4000 && node app.js
```

## 业务实现思路（超级重要）

[数据层开发](https://sanyuan0704.github.io/react-cloud-music/chapter3/redux.html)

## 性能及体验优化

* 图片懒加载
* 进场loading效果
* Redux数据缓存

### 利用Redux的数据来进行页面缓存

```javascript
// Recommend/index.js
// .....

useEffect(() => {
    // 如果页面有数据，则不发请求
    // immutable数据结构中长度属性size（数据缓存优化）
    if (!bannerList.size) getBannerDataDispatch()
    if (!recommendList.size) getRecommendListDataDispatch()
    // eslint-disable-next-line
  }, [])
```

## 本章核心知识强调

* **scroll基础组件开发**
* **数据层开发：主要是用Redux管理数据的那套流程必须烂熟于心**
* **进场loading组件体验优化**
