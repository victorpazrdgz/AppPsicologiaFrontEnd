<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Change PassWord</h2>

          <Notification :message="error" v-if="error"/>


          <form method="get" @submit.prevent="changePass">
            <div class="field">
              <label class="label">Old Password</label>

              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="oldPassword"
                  v-model="oldPassword"
                  required
                >
              </div>
            </div>

            <div class="field">
              <label class="label">New Password</label>

              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                  required
                >
              </div>
            </div>
            <div class="field">
              <label class="label">Repeat Password</label>

              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="confirmPassword"
                  v-model="confirmPassword"
                  required
                >
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Change</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import {store} from "~/store/user";
export default {
name: "ChangePassword",
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser', 'user']),
    user() {
      return store.state.user;
    },

  },
  data: () => ({
    oldPassword: null,
    password: null,
    confirmPassword: null,
    error: null,
  }),
  methods: {
    changePass() {
      if(this.password == this.confirmPassword) {
        console.log(this.user.userName)
        this.$axios.get("/changePassword", {
          params: {
            username: this.user.userName,
            oldpassword: this.oldPassword,
            password: this.password,
          }
        }).then(function (response) {
          store.commit('setUser',response.data)
          if (response.data !=null){
            if (response.data.role == 'USER') {
              $nuxt.$router.push(({path: ('user')}));
            }
            if (response.data.role == 'ADMIN') {
              console.log('MANDO ADMIN' + response.data)
              $nuxt.$router.push(({path: ('admin')}));
            }

          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
