<template>
  <section class="section">
    <div class="container">
      <p>Hola admin </p>
      <h2>Dynamically test Created:</h2>
      <div v-for='(item,index) in this.questionJson'>
        {{item.questionTitle}}
        <div v-if="item.typeQuestion === 'Text'">
          <textarea></textarea>
        </div>
        <div v-if="item.typeQuestion === 'Options'" v-for="item1 in item.options" >

            <input type="radio"> {{item1.option}}

        </div>
      </div>
      <button @click="newQuestion">Add question</button>
      <modaltemplate v-if="isModalVisible" :is="isModalVisible" ref="my-modal" @save="saveModal" @close="exitModal">
        <h2 slot="header" style="text-align: center">Create Question</h2>
        <div slot="body">
          <div class="field">
            <label class="label">Question</label>
            <div class="control">
              <input type="text" id="capture-title" placeholder="Question" v-model="questionTitle" style="width: 100%"/>
            </div>
          </div>
          <div class="field">
            <label class="label">Type Question</label>
            <div class="control">
              <select class="select" v-model="typeQuestion" placeholder=" Type Question" style="width: 100%">
                <option class="label" disabled value="">Choose an Option</option>
                <option class="label">Text</option>
                <option class="label">Options</option>
              </select>
            </div>
          </div>
          <div class="field" v-if="this.typeQuestion==='Options'" :key="numberOptions" @change="forceRerender">
            <label class="label">Number Options</label>
            <div class="control">
              <input type="number" v-model="numberOptions" :min="2" :max="10" inline controls/>
            </div>
            <label class="label">Question Options</label>
            <div class="control" v-for='(n,index) in this.numberOptionsRender'>
              {{ n }}
              <input type="text" v-model="questionOptions[n]">
            </div>
          </div>


        </div>
        <div slot="footer"></div>

      </modaltemplate>
    </div>
  </section>
</template>

<script>
    import { store } from '../store/question';

    export default {
        name: "Test",
        data: () => ({
            isModalVisible : null,
            idQuestion:1,
            questionTitle:null,
            typeQuestion:null,
            numberOptions: 2,
            numberOptionsRender:2,
            questionOptions:[],
            listOption: [],
            questionJson:[],
        }),
        // computed: {
        //     ...mapGetters(['question']),
        //     question() {
        //         return store.state.question;
        //     },
        // },
        methods: {
            async newQuestion() {
                this.isModalVisible = () => import("../components/ModalForm");
            },
            saveModal(){

                console.log(this.questionTitle);
                console.log(this.typeQuestion);

                if (this.typeQuestion === "Text")
                    this.questionJson.push({
                        "id": this.idQuestion,
                        "questionTitle": this.questionTitle,
                        "typeQuestion": this.typeQuestion
                    });
                else {
                    for (var i = 1; i <= this.numberOptions; i++) {
                        this.listOption.push({'option': this.questionOptions[i]});
                        console.log(this.questionOptions[i])
                    }
                    this.questionJson.push({
                        "id": this.idQuestion,
                        "questionTitle": this.questionTitle,
                        "typeQuestion": this.typeQuestion,
                        "options": this.listOption
                    });
                }
                console.log('json' + this.questionJson[0].questionTitle)
                store.commit('setQuestion',{"id":this.idQuestion,questionTitle: this.questionTitle, typeQuestion: this.typeQuestion,options:this.listOption})
                this.idQuestion++;
                this.listOption=[];
                this.isModalVisible = false;


            },
            exitModal() {
                this.isModalVisible= false

            },
            forceRerender() {
                if (this.numberOptions!=this.numberOptionsRender){
                    if (this.numberOptions>this.numberOptionsRender)
                        this.numberOptionsRender++;
                    else
                        this.numberOptionsRender--;
                    this.$forceUpdate();
                }
            }

        },
    }
</script>

<style scoped>

</style>
