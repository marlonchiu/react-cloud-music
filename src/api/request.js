import { axiosInstance } from './config'

// 获取轮播图数据
export const getBannnerRequest = () => {
  return axiosInstance.get('/banner')
}

// 获取轮播图数据
export const getRecommendListRequest = () => {
  return axiosInstance.get('/personalized')
}
