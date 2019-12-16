<template>
  <section class="section">
    <div class="container">
      <h2 class="title">My Profile</h2>

      <div class="content">
        <p>
          <strong>Username:</strong>
          {{ username }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ email }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        middleware: 'auth',
        data: function () {
            return {
                username: localStorage.getItem('username'),
                email:localStorage.getItem('email')
            }
        },
        computed: {
            ...mapGetters(['loggedInUser']),
        },
    };
</script>
