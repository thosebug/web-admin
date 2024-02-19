import { getPage } from '@/api/good'

const actions = {
  // getpage
  getPage({ commit }, goodQuery) {
    return new Promise((resolve, reject) => {
      getPage(goodQuery).then((response) => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
