<template>
  <section class="section">
    <div class="container">
      <h1>User Page </h1>

      <div v-for='(item,index) in this.loadedTest'>
        <a @click="renderTest(item)" href="#">{{item.testName}} </a>
      </div>
      <div>
      <render-test v-show="isRenderTest" v-bind:questions=this.questions v-bind:testName=this.testname
                   v-bind:isRenderTest=this.isRenderTest @close-render="updateRender"></render-test>
      </div>
    </div>
  </section>
</template>

<script>
    import RenderTest from "../components/RenderTest";

    export default {
        name: "user",
        components: {RenderTest},
        data: () => ({
            loadedTest: [],
            isRenderTest: null,
            testname: null,
            questions: [],
            options:[]


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
            renderTest(item) {
                this.isRenderTest = true;
                this.testname = item.testName
                this.questions = item;
                for (var i=0; i < this.questions.questions.length; i++ ) {
                    console.log("antes if" + this.questions.questions[i].options.length)
                    if (this.questions.questions[i].options.length > 0) {
                        this.questions.questions[i].options = this.randomMethod(this.questions.questions[i].options.length,this.questions.questions[i].options);
                    }
                }

                this.questions = this.randomMethod(item.questions.length,item.questions);
            },
            updateRender(value) {
                this.isRenderTest = value;
            },
            randomMethod(indexOption,temporaryOrderOptions){
                while (0 !== indexOption) {
                    // Pick a remaining element...
                    let randomIndexOption = Math.floor(Math.random() * indexOption);
                    indexOption -= 1;
                    // And swap it with the current element.
                    var temporaryValueOption = temporaryOrderOptions[indexOption];
                    temporaryOrderOptions[indexOption] =  temporaryOrderOptions[randomIndexOption];
                    temporaryOrderOptions[randomIndexOption] = temporaryValueOption;

                }
                return temporaryOrderOptions
            }
        }
    }
</script>

<style scoped>

</style>
