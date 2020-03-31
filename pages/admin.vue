<template>
  <section class="section" v-if="user.role=='ADMIN'">
    <div class="container">
      <p>Hola admin </p>
      <h2>Dynamically inserted:</h2>
<!--      <div v-if="question.question!=null"></div>-->
      <button @click="newTest">New Test</button>
      {{ user.userName }}

      <test v-if="isTestVisible" :is=" isTestVisible" >
      </test>
    </div>
  </section>
</template>

<script>
    import Test from "../components/Test";
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import { store } from '../store/user'
    import Bus from '~/assets/bus'
    export default {
        middleware: 'auth',

        // auth:{roles:{only:{"admin":user.role}}},
        computed: {
            ...mapGetters(['loggedInUser','user']),
           user(){
               return store.state.user;
           },

        },

        name: "admin",
        components: {Test},
        data: () => ({
            isTestVisible : null,

        }),
        methods: {
            async newTest() {
                this.isTestVisible = () => import("../components/Test");
            },

        },
        created: function() {
            Bus.$on('closeTest', (item) =>{
               this.isTestVisible = item;
            })
        },
    }
</script>

<style scoped>

</style>
