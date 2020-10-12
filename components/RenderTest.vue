<template>
  <section>
    <div class="container">

      <div class="columns is-centered" id="app">
        <div class="column is-half">
          <section class="section">
            <h1 class="title">{{this.testName}}</h1>
            <p class="subtitle">You must Complete all questions.</p>
            <hr>
              <form v-on:submit.prevent="$validator.validateAll()">
                  <div class="field" v-for='item in this.questions ' :key="item.idQuestion">
                    <label class="label">{{item.questionTitle}}</label>

                        <div class="control"  v-if="item.questionType === 'Text'">
                          <textarea class="textarea" v-model="responseQuestion[item.idQuestion]"></textarea>

                        </div>


                    <div class="control">
                      <label class="radio" v-if="item.questionType === 'Options'" v-for="item1 in item.options" style="width: 100%">
                        <input type="radio" :value="item1.option" v-model=" selectedOption[item.idQuestion]">{{item1.option}}


                      </label>
                    </div>
                  </div>


                <div class="field has-text-right">
                  <button @click="sendResult" class="button is-primary">Submit</button>
                </div>
              </form>
            </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {store} from '../store/user'

    export default {
        middleware: 'auth',

        // auth:{roles:{only:{"admin":user.role}}},
        computed: {
            ...mapGetters(['loggedInUser', 'user']),
            user() {
                return store.state.user;
            },

        },

        name: "RenderTest",
        props: ['questions', 'testName', 'isRenderTest','studio'],

        data: () => ({
            selectedOption: {},
            responseQuestion: {},
            resultJson: [],
            listResults: [],

        }),
        methods: {

            async sendResult() {
                // console.log(this.testName)
                // console.log(this.questions)

                for (var i = 0; i < this.questions.length; i++) {
                  //   console.log("id" + this.questions[i].idQuestion)
                  // console.log("texto" + this.responseQuestion[i + 1])
                  // for (var j = 0; j <this.selectedOption.length; j++) {
                  //   console.log('option' + this.selectedOption[j])
                  // }
                    if ( this.questions[i].questionType=='Text') {
                        this.listResults.push({
                            "idQuestion": this.questions[i].idQuestion,
                            "response": this.responseQuestion[i + 1]
                        })
                        console.log("data text " + i + " " + this.responseQuestion[i + 1])
                    }
                    if(this.questions[i].questionType=='Options') {
                        this.listResults.push({
                          "idQuestion": this.questions[i].idQuestion,
                          "response": this.selectedOption[i + 1]
                        })
                        console.log("data option" + this.selectedOption[i + 1])
                    }

                }
                this.resultJson.push({
                    "userName": this.user.userName,
                    "testName": this.testName,
                    "studio":this.studio,
                    "responses": this.listResults
                })
                console.log(this.resultJson)
                try {
                    await this.$axios.post('/test/response', {
                        "userName": this.user.userName,
                        "testName": this.testName,
                        "studio":this.studio,
                        "didTest":new Date(),
                        "responses": this.listResults
                    });
                    this.resultJson = [];
                    this.listResults =[];
                    this.$emit('close-render', false)

                } catch (e) {
                    this.error = e.response.data.message;
                }
            }
        },


    }
</script>

<style scoped>

</style>
