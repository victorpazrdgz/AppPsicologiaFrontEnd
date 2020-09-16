<template>
  <section class="section" v-if="user.role=='ADMIN'">
    <div class="container">
      <h2>Create New Test:
        <button @click="newTest" class="button is-success is-rounded">New Test</button>
      </h2>
      <!--      <div v-if="question.question!=null"></div>-->


      <!--      -->
      <div class="columns">
        <div class="column">
          <h2>Test Created:</h2>
          <div class="table__wrapper" style=": overflow-x: auto;overflow-y: auto; max-height:350px">
            <table class="table is-hoverable  is-fullwidth">
              <tbody >
              <tr v-for='(item,index) in this.loadedTest'>
                <td class="has-text-info is-size-4">{{item.testName}}</td>
                <td>
                  <button @click="editTest(item)" class="button is-primary is-rounded">Edit</button>
                </td>
                <td>
                  <button @click="deleteTest(item)" class="button is-danger is-rounded">Delete</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="column">
          <test v-if="isTestVisible" :is=" isTestVisible"></test>
          <edit-test v-show="isEditTest" v-if="isEditTest" v-bind:questions=this.questions v-bind:testName=this.testname
                     v-bind:test=this.test v-bind:editTest=this.isEditTest
                     @close-render="updateRender">

          </edit-test>
        </div>
      </div>
<!--      {{ this.loadedTest}}-->

    </div>
  </section>
</template>

<script>
    import Test from "../components/Test";

    import {mapGetters} from 'vuex';
    import {store} from '../store/user'
    import Bus from '~/assets/bus'
    import EditTest from "../components/EditTest";

    export default {
        middleware: 'auth',

        // auth:{roles:{only:{"admin":user.role}}},
        computed: {
            ...mapGetters(['loggedInUser', 'user']),
            user() {
                return store.state.user;
            },

        },

        name: "admin",
        components: {Test, EditTest},
        data: () => ({
            isTestVisible: null,
            loadedTest: [],
            isEditTest: null,
            testname: null,
            test: null,
            questions: [],
        }),

        mounted: function () {
            this.callTest()
        },
        methods: {
            async newTest() {
                this.isTestVisible = () => import("../components/Test");
                this.isEditTest = false;
            },
            async callTest() {
                this.$axios.get("/tests").then(response => {
                    this.loadedTest = response.data;
                    console.log("data" + this.loadedTest.length)
                    for (var i = 0; i < this.loadedTest.length; i++)
                        console.log("hola" + this.loadedTest[i].testName)

                })
            },
            async editTest(item) {


                this.testname = item.testName;
                console.log(item)
                this.test = item
                this.questions = item.questions;
                this.isEditTest = true;
                this.isTestVisible = false;
            },
            async deleteTest(item) {
                this.isEditTest = false;

            },
            updateRender(value) {
                this.isRenderTest = value;
            },
        },

        created: function () {
            Bus.$on('closeTest', (item) => {
                this.callTest();
                this.isTestVisible = item;
                this.isEditTest = item
            })
        },

    }
</script>

<style scoped>

</style>
