// import http from '@/services/http.js'
import search from '@/utils/search.js'
import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    packages: [],
  },
  actions: {
    async searchPackage({ commit }, name) {
      await search(name, 0, 100)
        .then((data) => {
          commit('setSearchPackage', data.response.hits)
        })
    }
  },
  mutations: {
    setSearchPackage(state, payload) {
      let packages = [];
      packages.push(...payload)
      Vue.set(state.packages, 0, packages)
    },
    clearPackagesState(state) {
      Vue.set(state.packages, 0, [])
    }
  },
  getters: {
    getPackages(state) {
      return state.packages[0];
    },
  },
};
