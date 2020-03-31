<template>
  <section>
    <div class="container">
      hola render test
      {{user.userName}}
      <div v-for='item in this.questions ' :key ="item.idQuestion">

       <div > {{item.questionTitle}}</div>
        <div v-if="item.questionType === 'Text'">
          <textarea    v-model="responseQuestion[item.idQuestion]" ></textarea>
        </div>
        <div v-if="item.questionType === 'Options'" v-for="item1 in item.options">

          <input type="radio"  :value="item1.option"  v-model=" selectedOption[item.idQuestion]" ><label>{{item1.option}}</label>


        </div>
      </div>
      <button @click="sendResult">Save Test</button>
    </div>
  </section>
</template>

<script>
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

        name: "RenderTest",
        props: ['questions','testName','isRenderTest'] ,

        data: () => ({
                selectedOption:{},
                responseQuestion:{},
                resultJson:[],
                listResults:[]

        }),
        methods:{
            async sendResult() {
                console.log(this.testName)
                console.log(this.questions)

                for (var i = 0; i < this.questions.length; i++) {
                    console.log("id" + this.questions[i].idQuestion)
                    if (this.responseQuestion[i + 1] != null || this.responseQuestion[i + 1] != undefined) {
                        this.listResults.push({
                            "idQuestion": this.questions[i].idQuestion,
                            "response": this.responseQuestion[i + 1]
                        })
                        console.log("data text " + i + " " + this.responseQuestion[i + 1])
                    } else {
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
                    "responses": this.listResults
                })
                console.log(this.resultJson)
                try {
                    await this.$axios.post('/test/response', {
                        "userName": this.user.userName,
                        "testName": this.testName,
                        "responses": this.listResults
                    });

                   this.$emit('close-render', false)

                } catch (e) {
                    this.error = e.response.data.message;
                }
            }
        }
    }
</script>

<style scoped>

</style>
