<template>
  <section class="section" v-if="user.role=='ADMIN'">
    <div class="container">
      <div class="columns">
        <div class="column">
          <img class="AppLogo" style="padding-top:2%; text-align: center" src="~/assets/images/logo_uned.gif">
        </div>
        <div class="column">
          <img class="AppLogo" style="padding-top:2%; text-align: center" src="~/assets/images/logo_psicologia.gif">
        </div>
      </div>
      <div class="tabs">
        <ul>
          <li v-bind:class="{ 'is-active': isActive == 'createTest' }"><a
            @click="isActive =createTest(); 'createTest'">{{ 'Create Test' }}</a></li>
          <li v-bind:class="{ 'is-active': isActive == 'dataInfo' }"><a
            @click="dataInfo(); isActive = 'dataInfo'">{{ 'Data Information' }}</a></li>
          <li v-bind:class="{ 'is-active': isActive == 'users' }"><a
            @click="userModule();isActive = 'users'">{{ 'Users' }}</a></li>
        </ul>
      </div>
      <div class="container" v-if="isCreateTest" >
        <h1 style="padding-top:1%;color: darkgreen; font-size: xx-large;text-align: center">{{'Create Test' }}</h1>
        <div class="divider" style="background: cornflowerblue"></div>
        <h2 style="padding-top: 5%" class="label">Create New Test
          <button @click="newTest" class="button is-success is-rounded">New Test</button>
        </h2>
        <!--      <div v-if="question.question!=null"></div>-->


        <!--      -->
        <div class="columns">
          <div class="column">
            <h2>Test Created:</h2>
            <div class="table__wrapper" style=": overflow-x: auto;overflow-y: auto; max-height:350px">
              <table class="table is-hoverable  is-fullwidth">
                <tbody>
                <tr v-for='(item,index) in this.loadedTest'>
                  <td class="has-text-info is-size-4">{{ item.testName }}</td>
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
            <edit-test v-show="isEditTest" v-if="isEditTest" v-bind:questions=this.questions
                       v-bind:testName=this.testname
                       v-bind:test=this.test v-bind:editTest=this.isEditTest
                       @close-render="updateRender">

            </edit-test>
          </div>
        </div>
      </div>  <!--      {{ this.loadedTest}}-->
     <data-information v-if="isDataInfo" :is="isDataInfo"></data-information>
      <users-module v-if="isUserModule" :is="isUserModule"></users-module>
      </div>
  </section>
</template>

<script>
import Test from "../components/Test";

import {mapGetters} from 'vuex';
import {store} from '../store/user'
import Bus from '~/assets/bus'
import EditTest from "../components/EditTest";
import DataInformation from "@/components/DataInformation";
import UsersModule from "@/components/UsersModule";

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
  components: {UsersModule, DataInformation, Test, EditTest},
  data: () => ({
    isActive: 'createTest',
    isCreateTest:true,
    isDataInfo:false,
    isTestVisible: null,
    isUserModule:false,
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
      this.$forceUpdate();
      this.testname = item.testName;
      console.log(item)
      this.test = item
      this.questions = item.questions;
      this.isEditTest = true;
      this.isTestVisible = false;
    },
    async deleteTest(item) {
      this.isEditTest = false;
      try {
        this.$axios.delete('/delete', {
          data: {
            id: item.id
          }
        }).then(response => {
          if (response.data = true) {
            this.$forceUpdate();
            this.callTest()
          }

        });
      } catch (e) {
        this.error = e.response.data.message;
      }

    },
    updateRender(value) {
      this.isRenderTest = value;

    },
    createTest(){
      this.isCreateTest = true;
      this.isDataInfo = false;
      this.isUserModule = false;
    },
    dataInfo(){
      this.isCreateTest = false;
      this.isDataInfo = true;
      this.isUserModule = false;
      this.isDataInfo = () => import("../components/DataInformation");
    },
    userModule(){
      this.isCreateTest = false;
      this.isDataInfo = false;
      this.isUserModule = true;
      this.isUserModule = () => import("../components/UsersModule");
    }
  },

  created: function () {
    Bus.$on('closeTest', (item) => {
      console.log("entro close")
      this.callTest();
      this.isTestVisible = item;
      this.isEditTest = item
      this.$forceUpdate();
    })
  },

}
</script>

<style scoped>

</style>
