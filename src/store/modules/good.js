import { deleteGood, getPage, updateIsBan } from '@/api/good'

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
  },
  updateIsBan({ commit }, banInfo) {
    return new Promise((resolve, reject) => {
      updateIsBan({ id: banInfo.id, isBan: banInfo.isban }).then((response) => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteGood({ commit }, goodId) {
    return new Promise((resolve, reject) => {
      deleteGood(goodId).then((response) => {
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
