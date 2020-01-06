<template>
  <nav class="navbar is-light">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">App Psicologia</nuxt-link>

        <button class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable" v-if="isAuthenticated">
            <a class="navbar-link">
              {{ user.userName }}
            </a>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item" to="/profile">My Profile</nuxt-link>
              <hr class="navbar-divider">
              <a class="navbar-item" @click="logout">Logout</a>
            </div>
          </div>
          <template v-else>
            <nuxt-link class="navbar-item" to="/register">Register</nuxt-link>
            <nuxt-link class="navbar-item" to="/login">Log In</nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { store } from '../store/user'
    export default {
        computed: {
            ...mapGetters(['isAuthenticated']),
            user(){
                return store.state.user;
            },
        },
        methods: {
            async logout() {
                await this.$auth.logout();
            },
        },
    };
</script>

