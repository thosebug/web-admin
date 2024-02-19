import request from '@/utils/request'

export function getPage(data) {
  return request({
    url: '/good/page',
    method: 'post',
    data
  })
}
