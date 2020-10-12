<template>
  <section class="section">
    <div class="container">
      <h1 style="padding-top:1%;color: darkgreen; font-size: xx-large;text-align: center">{{ 'My Profile' }}</h1>

      <div class="content">
        <p>
          <strong>Username:</strong>
          {{ user.userName }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ user.email }}
        </p>
      </div>
      <button @click="exit()" class="button is-warning is-rounded">Exit</button>
    </div>
  </section>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { store } from '../store/user'
    export default {
        middleware: 'auth',

        computed: {
            ...mapGetters(['loggedInUser','user']),
           user(){
               return store.state.user;
           },

        },
      methods:{
          exit(){
            if (this.user.role == "USER")
              this.$router.push('/user')
            if (this.user.role == "ADMIN")
              this.$router.push('/admin')

          }
      }
    };
</script>
