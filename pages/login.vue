<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h5 class="title has-text-centered">App Access</h5>

          <Notification :message="error" v-if="error"/>

          <form method="post" @submit.prevent="login">

            <div class="field">
              <label class="label">UserName</label>

              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="userName"
                  v-model="userName"
                >
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>

              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                >
              </div>
            </div>

            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Log In</button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            <p>
              Don't have an account? <nuxt-link to="/register">Register</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
    import Notification from '~/components/Notification';

    export default {
        middleware: 'guest',
        components: {
            Notification,
        },
        data() {
            return {
                userName: '',
                password: '',
                error: null,
            };
        },
        methods: {
             login() {
                try {
                    this.$auth.loginWith('local', {
                        data: {
                            userName: this.userName,
                            password: this.password,
                        },
                    }).then(() =>{
                        console.log('hola');

                        this.$axios.post('/user',{userName: this.userName}).then(function (response){
                            console.log(response.data);
                           localStorage.setItem('username',response.data.userName);
                            localStorage.setItem('email',response.data.email);


                        })

                        ;
                        this.$router.push('/');

                    })

                } catch (e) {
                    this.error = e.response.data.message;
                }
            },
        },
    };
</script>
