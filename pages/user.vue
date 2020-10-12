<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <img class="AppLogo" style="padding-top:2%; text-align: center" src="~/assets/images/logo_uned.gif">
        </div>
        <div class="column">
          <img class="AppLogo" style="padding-top:2%; text-align: center" src="~/assets/images/logo_psicologia.gif">
        </div>
      </div>
      <div v-for='studio in this.user.assignedStudios'>
       <h4> {{ studio.studioName }}</h4>
        <div v-for='test in studio.studioTests'>
          <a @click="renderTest(test,studio)" href="#">{{ test.testName }} </a>
        </div>
      </div>
      <div>
        <render-test v-show="isRenderTest" v-bind:questions=this.questions v-bind:testName=this.testname
                     v-bind:isRenderTest=this.isRenderTest v-bind:studio=this.studio @close-render="updateRender"></render-test>
      </div>

    </div>
  </section>
</template>

<script>
import RenderTest from "../components/RenderTest";
import {mapGetters} from "vuex";
import {store} from "@/store/user";

export default {
  middleware: 'auth',

  computed: {
    ...mapGetters(['loggedInUser', 'user']),
    user() {
      return store.state.user;
    },

  },
  name: "user",
  components: {RenderTest},
  data: () => ({
    loadedTest: [],
    isRenderTest: null,
    testname: null,
    studio: null,
    questions: [],
    options: []


  }),
  mounted() {
    this.$axios.get("/tests").then(response => {
      this.loadedTest = response.data;
      console.log("data" + this.loadedTest.length)
      for (var i = 0; i < this.loadedTest.length; i++)
        console.log("hola" + this.loadedTest[i].testName)
    })
  },
  methods: {
    renderTest(test,studio) {
      this.isRenderTest = true;
      this.testname = test.testName
      this.studio = studio.studioName
      this.questions = test.questions;

      // for (var i = 0; i < this.questions.questions.length; i++) {
      //   console.log("antes if" + this.questions.questions[i].options.length)
      //   if (this.questions.questions[i].options.length > 0) {
      //     this.questions.questions[i].options = this.randomMethod(this.questions.questions[i].options.length, this.questions.questions[i].options);
      //   }
      // }
      // this.questions = this.randomMethod(test.questions.length, test.questions);
    },
    updateRender(value) {
      this.isRenderTest = value;
    },
    randomMethod(indexOption, temporaryOrderOptions) {
      while (0 !== indexOption) {
        // Pick a remaining element...
        let randomIndexOption = Math.floor(Math.random() * indexOption);
        indexOption -= 1;
        // And swap it with the current element.
        var temporaryValueOption = temporaryOrderOptions[indexOption];
        temporaryOrderOptions[indexOption] = temporaryOrderOptions[randomIndexOption];
        temporaryOrderOptions[randomIndexOption] = temporaryValueOption;

      }
      return temporaryOrderOptions
    }
  }
}
</script>

<style scoped>

</style>
