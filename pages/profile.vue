<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>

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
    </div>
  </section>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { storeUser } from '../store/user'
    export default {
        middleware: 'auth',

        computed: {
            ...mapGetters(['loggedInUser']),
           user(){
               console.log('usuario' + storeUser.state.user.userName)
               return storeUser.state.user;
           },

        },
    };
</script>
