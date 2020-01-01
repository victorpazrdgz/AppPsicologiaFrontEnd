import Vuex from 'vuex';

export const storeUser = new Vuex.Store({
  state:{ user:{}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  },

});
