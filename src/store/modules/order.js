import { getPage, getQuery } from '@/api/order'

const actions = {
  // getpage
  getQuery({ commit }) {
    return new Promise((resolve, reject) => {
      getQuery().then((response) => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getPage({ commit }, orderQuery) {
    return new Promise((resolve, reject) => {
      getPage(orderQuery).then((response) => {
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
