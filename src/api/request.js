import { axiosInstance } from './config'

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
