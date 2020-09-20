<template>
  <section>
    <div class="container">

      <div class="columns is-centered" id="app">
        <div class="column ">
          <section class="section">
            <h1 class="title">{{this.testName}}</h1>
            <hr>

              <div class="field" v-for='item in this.questions' :key="item.idQuestion">

                <label class="label">{{item.questionTitle}} <button @click="editQuestion(item)" class="button is-primary is-rounded"> Edit Question</button></label>

                <div class="control"  v-if="item.questionType === 'Text'">
                  <textarea class="textarea" ></textarea>

                </div>
                <div class="control"  >
                  <label class="radio is-flex-mobile" v-if="item.questionType === 'Options'" v-for="item1 in item.options" style="align-items:  inherit">
                    <input type="radio" :value="item1.option">{{item1.option}}
                  </label>
                </div>
              </div>
<!--            {{this.test}}-->
            <div>
              <button @click="newQuestion" class="button  is-info is-rounded"> Add question</button>
            </div>
            <div style="padding-top: 20px">
            <button @click="saveTest" class="button is-success is-rounded is-pulled-right">Save Test</button>
            <button @click="exitTest" class="button is-danger is-rounded is-pulled-right">Exit</button>
            </div>
            <modaltemplate v-if="isModalVisible" :is="isModalVisible" ref="my-modal" @save="saveModal" @close="exitModal">
              <h2 slot="header" style="color: midnightblue; font-size:120%; text-align: center"><img class="AppLogo"  style="padding-top:2%; text-align: center; width: 10%;height: 10%;padding-left: 2%"  src="~/assets/images/logo_uned.gif"><span style=";padding-left: 2%">Create or Edit Question</span></h2>
              <div slot="body">
                <div class="field">

                  <label class="label">Question</label>
                  <div class="control">
                    <input type="text" id="capture-title" class="input is-rounded is-focused"  v-model="questionTitle"  style="width: 100%"/>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Type Question</label>
                  <div class="control select is-rounded is-focused">
                    <select class="select" v-model="questionType" placeholder=" Type Question" style="width: 100%">
                      <option class="label" disabled value="">Choose an Option</option>
                      <option class="label">Text</option>
                      <option class="label">Options</option>
                    </select>
                  </div>
                </div>

                <div class="field" v-if="this.questionType==='Options'" :key="numberOptions" @change="forceRerender">
                  <label class="label">Number Options</label>
                  <div class="control">
                    <input type="number"  class="input is-rounded" v-model="numberOptions" :min="2" :max="10" inline controls/>
                  </div>
                  <label class="label">Question Options</label>
                  <div class="control" v-for='(n,index) in this.numberOptionsRender'>
<!--                    {{this.questionOptions[n-1]}}-->
                    {{ n }}
                    <input type="text"  class="input is-rounded"v-model="questionOptions[n-1].option" >

                  </div>
                </div>


              </div>
              <div slot="footer"></div>

            </modaltemplate>

          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
    import Bus from '~/assets/bus'
    export default {
        name: "EditTest",
        props: ['questions', 'testName', 'isEditTest','test'],
        data: () => ({

            isModalVisible: null,
            isNewQuestion: false,
            numberOptionsRender:2,
            questionTitle:null,
            questionType :"",
            numberOptions: 2,
            questionOptions: [],
            idQuestion:0

        }),
        methods:{
            editQuestion(item){
                this.isModalVisible = () => import("../components/ModalForm");
                console.log(item)
                if (item != undefined) {
                    this.questionType = item.questionType;
                    this.questionTitle = item.questionTitle;
                    this.questionOptions = item.options;
                    this.idQuestion = item.idQuestion;
                    if (item.options.length > 0) {
                        this.numberOptions = item.options.length;
                        this.numberOptionsRender = item.options.length;
                    } else {
                        for (var i = 0; i < this.numberOptions; i++)
                            this.questionOptions.push({"option": this.questionOptions[i]});
                    }
                }else{
                    this.isNewQuestion = true;
                    this.idQuestion = this.test.questions.length + 1;
                    for (var i = 0; i < this.numberOptions; i++)
                        this.questionOptions.push({"option": this.questionOptions[i]});
                }


            },
          async newQuestion() {
            this.isNewQuestion = true;
            this.isModalVisible = () => import("../components/ModalForm");
          },
            saveModal(){
                console.log(this.questionTitle)
                if (this.isNewQuestion){
                    if(this.questionType=="Text")
                        this.test.questions.push({"idQuestion":this.idQuestion,"questionTitle":this.questionTitle,"questionType":this.questionType,"options":[]});
                    else
                        this.test.questions.push({"idQuestion":this.idQuestion,"questionTitle":this.questionTitle,"questionType":this.questionType,"options":this.questionOptions});
                }else {
                    this.test.questions[this.idQuestion - 1].questionTitle = this.questionTitle;
                    if (this.questionType === "Text") {
                        this.test.questions[this.idQuestion - 1].questionType = this.questionType;
                        if (this.test.questions[this.idQuestion - 1].options != null)
                            this.test.questions[this.idQuestion - 1].options = [];
                        console.log("item" + this.questionType);
                    } else {
                        this.test.questions[this.idQuestion - 1].questionType = this.questionType;
                    }
                }
                this.questionTitle = null;
                this.questionOptions = [];
                this.isNewQuestion = false;
                this.isModalVisible = false;
            },
            exitModal() {
                this.isModalVisible = false

            },
            forceRerender() {
                if (this.numberOptions != this.numberOptionsRender) {
                    console.log("number" + this.numberOptions)
                    if (this.numberOptions > this.numberOptionsRender) {
                        this.numberOptionsRender++;
                        this.questionOptions.push({"option": this.questionOptions[this.numberOptions - 1]});
                    }

                    else{
                        this.numberOptionsRender--;

                        this.questionOptions.pop({"option": this.questionOptions[this.numberOptions]});
                        console.log(this.numberOptions)
                        console.log(this.questionOptions)
                    }

                    this.$forceUpdate();
                }
            },
            saveTest(){
                console.log("save");
                try {
                    this.$axios.put('/test/update', {
                        // test:this.test
                        id:this.test.id,
                        testName: this.test.testName,
                        questions: this.test.questions,
                    });
                    Bus.$emit('closeTest', false)
                    this.$router.push('/admin');
                } catch (e ) {
                    this.error = e;
                }
            },
            exitTest(){
                Bus.$emit('closeTest', false)
                this.$router.push('/admin');
            }
        }
    }

</script>

<style scoped>

</style>
