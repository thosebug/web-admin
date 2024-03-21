import {  getQuery, getPage, createOrder, deleteOrder, updateOrder, updateIsBan } from '@/api/order'

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
  },

  createOrder({ commit }, goodData) {
    return new Promise((resolve, reject) => {
      createOrder(goodData).then((response) => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateOrder({ commit }, goodData) {
    return new Promise((resolve, reject) => {
      updateOrder(goodData).then((response) => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteOrder({ commit }, goodId) {
    return new Promise((resolve, reject) => {
      deleteOrder(goodId).then((response) => {
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
