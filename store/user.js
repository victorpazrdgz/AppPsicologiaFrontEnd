import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });
Vue.use(Vuex);
export const store = new Vuex.Store({
  state:{ user:{}
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: key => ls.remove(key)
      },
      paths: ["user"],
    })
  ]
});

