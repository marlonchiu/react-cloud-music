import {
  axiosInstance
} from './config'

// 获取轮播图数据
export const getBannerRequest = () => {
  return axiosInstance.get('/banner')
}

// 获取轮播图数据
export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}

// 获取热门歌手数据
export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`)
}

// 获取歌手分类列表数据
export const getSingerListRequest = (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`)
}

// 获取排行榜数据
export const getRankListRequest = () => {
  return axiosInstance.get('/toplist/detail')
}

// 获取歌单详情数据
export const getAlbumDetailRequest = id => {
  return axiosInstance.get(`/playlist/detail?id=${id}`)
}

// 获取歌手详情数据
export const getSingerInfoRequest = id => {
  return axiosInstance.get(`/artists?id=${id}`)
}

// 获取歌词数据
export const getLyricRequest = id => {
  return axiosInstance.get(`/lyric?id=${id}`)
}

// 热搜列表(简略)
export const getHotKeyWordsRequest = () => {
  return axiosInstance.get(`/search/hot`)
}

// 搜索建议
// 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单 ,mv 信息
export const getSuggestListRequest = query => {
  return axiosInstance.get(`/search/suggest?keywords=${query}`)
}

// 搜索
// 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 ,
// 关键词可以多个, 以空格隔开, 如 " 周杰伦 搁浅 "(不需要登录),
// 搜索获取的 mp3url 不能直接用, 可通过 / song / url 接口传入歌曲 id 获取具体的播放链接
// 必选参数 : keywords : 关键词
// 可选参数:
//    limit: 返回数量, 默认为 30 offset: 偏移数量，用于分页,
//      如 : 如: (页数 - 1) * 30, 其中 30 为 limit 的值, 默认为 0
//    type: 搜索类型；默认为 1 即单曲 ,
//      取值意义: 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018: 综合
export const getResultSongsListRequest = query => {
  return axiosInstance.get(`/search?keywords=${query}`)
}
