import request from '@/utils/request'

export function getQuery() {
  return request({
    url: 'order/query',
    method: 'get'
  })
}

export function getPage(data) {
  return request({
    url: '/order/page',
    method: 'post',
    data
  })
}
