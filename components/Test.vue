<template>
  <section class="section">
    <div class="container">
      <p>Hola admin </p>
      <h2>Dynamically test Created:</h2>

      <div v-show="!isTestHaveName" >
        <h2 style="text-align: center">Create Test</h2>

          <div class="field">
            <label class="label">Test Name</label>
            <div class="control">
              <input type="text" placeholder="Test Name" v-model="testName" style="width: 100%"/>

            </div>
            <button  @click="newQuestion">OK</button>
            <button  @click="exitTest">Cancel</button>
          </div>


      </div>

      <div v-for='(item,index) in this.questionJson'>
        {{item.questionTitle}}
        <div v-if="item.questionType === 'Text'">
          <textarea></textarea>
        </div>
        <div v-if="item.questionType === 'Options'" v-for="item1 in item.options">

          <input type="radio"> {{item1.option}}

        </div>
      </div>

      <button  v-show="isTestHaveName" @click="newQuestion">Add question</button>

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
    <div v-if=" this.questionJson.length > 0">
      <button @click="saveTest">Save Test</button>

    </div>
  </section>
</template>

<script>
    import {store} from '../store/question';
    import Bus from '~/assets/bus'

    export default {
        name: "Test",
        data: () => ({
            isModalVisible: null,
            idQuestion: 1,
            questionTitle: null,
            questionType: null,
            numberOptions: 2,
            numberOptionsRender: 2,
            questionOptions: [],
            listOption: [],
            questionJson: [],
            testName: null,
            isTestHaveName: null,
            option: null
        }),
        // computed: {
        //     ...mapGetters(['question']),
        //     question() {
        //         return store.state.question;
        //     },
        // },
        methods: {
            async newQuestion() {
                console.log("json" + this.questionJson.length)
                this.isTestHaveName = true;
                this.isModalVisible = () => import("../components/ModalForm");
            },
            saveModal() {

                console.log(this.questionTitle);


                if (this.questionType === "Text")
                    this.questionJson.push({
                        "idQuestion": this.idQuestion,
                        "questionTitle": this.questionTitle,
                        "questionType": this.questionType,
                    });
                else {
                    for (var i = 1; i <= this.numberOptions; i++) {
                        this.listOption.push({"option": this.questionOptions[i]});
                        console.log(this.questionOptions[i])
                    }
                    for (var i = 0; i <= this.listOption.length; i++) {
                        console.log(this.listOption.length)
                    }

                    this.questionJson.push({
                        "idQuestion": this.idQuestion,
                        "questionTitle": this.questionTitle,
                        "questionType": this.questionType,
                        "options": this.listOption
                    });
                }
                console.log('json' + this.questionJson[0].questionTitle)
                store.commit('setQuestion', {
                    "id": this.idQuestion,
                    questionTitle: this.questionTitle,
                    questionType: this.questionType,
                    options: this.listOption
                })
                console.log("id" + this.idQuestion)
                this.idQuestion++;
                this.listOption = [];
                this.isModalVisible = false;


            },
            exitModal() {
                this.isModalVisible = false

            },

            forceRerender() {
                if (this.numberOptions != this.numberOptionsRender) {
                    if (this.numberOptions > this.numberOptionsRender)
                        this.numberOptionsRender++;
                    else
                        this.numberOptionsRender--;
                    this.$forceUpdate();
                }
            },
            async saveTest() {
                console.log("salvando test" + this.questionJson.length);
                for (var i = 0; i < this.questionJson.length; i++) {
                    console.log("entro for : " + i);
                    console.log(this.questionJson[i].questionTitle);

                }
                try {
                    await this.$axios.post('/test/new', {
                        testName: this.testName,
                        questions: this.questionJson,
                    });
                    Bus.$emit('closeTest', false)
                    this.$router.push('/admin');
                } catch (e) {
                    this.error = e.response.data.message;
                }

            },
            exitTest(){
                Bus.$emit('closeTest', false)
                this.$router.push('/admin');
            }

        },
    }
</script>

<style scoped>

</style>
