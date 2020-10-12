<template>
  <div class="container">
    <h1 style="padding-top:1%;color: darkgreen; font-size: xx-large;text-align: center">{{'Data Information' }}</h1>

    <div class="columns" style="padding-top: 2%">
      <div class="column">
        <div class="field">
          <label class="label">Filter By: Studio</label>
          <div class="control select is-rounded"style="width: 100%">
            <select  v-model="studio" @change="callStudioName()" style="width: 100%;border-color: orangered">
              <option class="label" disabled value = null>Choose an Option</option>
              <option   value="all">All Data</option>
              <option v-for=" studio in loadedStudios" v-bind:value="studio">
                {{ studio.studioName }}
              </option>

            </select>
          </div>
        </div>
      </div>
      <div class="column" v-if="isFilterTest">
        <div class="field">
          <label class="label">Filter By: Test</label>
          <div class="control select is-rounded"style="width: 100%">
            <select  v-model="test" @change="callStudioTestName()" style="width: 100%;border-color: orangered">
              <option class="label" disabled value = null>Choose an Option</option>
              <option   value="all">All Data</option>
              <option v-for=" test in this.studio.studioTests" v-bind:value="test">
                {{ test.testName }}
              </option>

            </select>
          </div>
        </div>
      </div>
      <div class="column" v-if="isFilterParam">
        <div class="field">
          <label class="label">Filter By: Parameter</label>
          <div class="control select is-rounded"style="width: 100%">
            <select  v-model="param" @change="callStudioTestNameParam()" style="width: 100%;border-color: orangered">
              <option class="label" disabled value = null>Choose an Option</option>
              <option   value="all">All</option>
              <option   value="date">Date</option>
              <option   value="question">Question</option>
            </select>
          </div>
        </div>
      </div>
      <div class="column" v-if="isQuestion">
        <div class="field">
          <label class="label">Filter By: Question</label>
          <div class="control select is-rounded"style="width: 100%">
            <select  v-model="question" @change="callQuestion()" style="width: 100%;border-color: orangered">
              <option class="label" disabled value = null>Choose an Option</option>
              <option   value="all">All Data</option>
              <option v-for=" question in this.test.questions" v-bind:value="question">
                {{ question.questionTitle }}
              </option>
            </select>
          </div>
        </div>
      </div>
        <div class="column"  v-if="isDate">
          <div class="field">
            <label class="label">Date Time</label>
            <div class="control " style="width: 100%">
              <input type="datetime-local" class="calendar" @change="callDate()"v-model="date">
            </div>
          </div>
        </div>
    </div>
    <div class="table__wrapper" v-if="!isQuestion"style=": overflow-x: auto;overflow-y: auto; max-height:100%;padding-top: 2%">
      <table class="table is-hoverable  is-fullwidth">
        <thead>
        <tr>
          <th>Studio</th>
          <th>TestName</th>
          <th>Date</th>
          <th>UserName</th>
          <th>Response</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='(item,index) in filteredResponses'>
          <td>{{ item.studio}}</td>
          <td>{{ item.testName }}</td>
          <td>{{ item.didTest}}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.responses }}</td>
        </tr>

        </tbody>
      </table>
    </div>
    <div class="table__wrapper" v-if="isQuestion" style=": overflow-x: auto;overflow-y: auto; max-height:100%;padding-top: 2%">
      <table class="table is-hoverable  is-fullwidth">
        <thead>
        <tr>
          <th>Studio</th>
          <th>TestName</th>
          <th>Date</th>
          <th>UserName</th>
          <th>Response</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='(item,index) in paramQuestions'>
          <td>{{ item.studio}}</td>
          <td>{{ item.testName }}</td>
          <td>{{ item.date}}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.response }}</td>
        </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
name: "DataInformation",
  data: () =>({
    loadedTestResponse:[],
    testName:'',
    studio:null,
    test:null,
    param:null,
    question:null,
    date:null,
    loadedStudios:[],
    filteredResponses:[],
    paramQuestions:[],
    isQuestion:false,
    isDate:false,
    isFilterTest:false,
    isFilterParam:false,
    responseFilter:'',
  }),
  mounted:function (){
  this.callTestsResponse();
  this.callStudios();

  },
  methods:{
    callTestsResponse(){
      let duplicate = false;
      this.$axios.$get('/responses').then( response => {
        this.loadedTestResponse = response;
        this.filteredResponses= this.loadedTestResponse;
        for(let i=0;i<this.filteredResponses.length;i++){
          this.filteredResponses[i].didTest = new Date (this.filteredResponses[i].didTest ).toUTCString()
        }
       // for(let i=0;i<this.loadedTestResponse.length;i++){
       //   duplicate = false;
       //   for(let j=0;j<this.testsname.length;j++){
       //     if(this.loadedTestResponse[i].testName == this.testsname[j].testName)
       //       duplicate=true;
       //   }
       //   if (duplicate == false) {
       //     this.testsname.push({testName:this.loadedTestResponse[i].testName});
       //   }
       // }
        console.log("respuestas" +this.loadedTestResponse)
      })
    },
    callStudioName(){
      console.log(this.studio)
      this.filteredResponses = [];
      if(this.studio == 'all'){
        this.callTestsResponse();
        this.isFilterParam = false;
        this.isFilterTest = false;
        this.isQuestion =false
      }

      else{
        for (var i = 0; i < this.loadedTestResponse.length; i++) {
          if(this.loadedTestResponse[i].studio == this.studio.studioName)
            this.filteredResponses.push(this.loadedTestResponse[i])
        }
        this.isFilterTest = true;
      }

      // this.$axios.$get('/responses/testName',{
      //   params:{
      //     testName: this.testName.testName
      //   }
      // }).then(response =>{
      //   console.log(response);
      //   this.loadedTestResponse = response;
      // })
    },
    async callStudios() {
      this.$axios.get("/studios").then(response => {
        this.loadedStudios = response.data;
      })
    },
    callStudioTestName(){
      console.log(this.test)
      this.filteredResponses = [];
      if(this.test == 'all'){
        this.callStudioName()
        this.isFilterParam = false;
      }

      else{
        for (var i = 0; i < this.loadedTestResponse.length; i++) {
          if((this.loadedTestResponse[i].testName == this.test.testName)  && (this.loadedTestResponse[i].studio == this.studio.studioName))
            this.filteredResponses.push(this.loadedTestResponse[i])
        }
        this.isFilterTest = true;
        this.isFilterParam = true;
      }
    },
    callStudioTestNameParam(){
      if(this.param == "question") {
        this.paramQuestions = []
        this.isDate = false;
        this.isQuestion = true;
      }
      if(this.param == "date") {
        this.date = null;
        this.isDate = true;
        this.isQuestion = false;
      }
      if(this.param == 'all'){
        this.callStudioTestName();
        this.date = null;
        this.isDate = false;
        this.isDate = false;
      }

    },
    callQuestion(){
      this.paramQuestions = [];
      for (var i = 0; i < this.filteredResponses.length; i++) {
        for (var j = 0; j < this.filteredResponses[i].responses.length; j++){
         if( this.filteredResponses[i].responses[j].idQuestion == this.question.idQuestion)
           this.responseFilter = this.filteredResponses[i].responses[j].response
        }
        console.log("respuesta ********************"+ this.responseFilter)
        this.paramQuestions.push({
          'studio':this.filteredResponses[i].studio,
          'testName':this.filteredResponses[i].testName,
          'date':this.filteredResponses[i].didTest,
          'userName':this.filteredResponses[i].userName,
          'response':this.responseFilter
        })
      }
    },
    callDate(){
      var dateCompare
      console.log(Date.parse(this.date));
      this.filteredResponses = [];
        for (var i = 0; i < this.loadedTestResponse.length; i++) {
          Date.parse(this.loadedTestResponse[i].didTest)
          if((this.loadedTestResponse[i].testName == this.test.testName)  && (this.loadedTestResponse[i].studio == this.studio.studioName) && ( Date.parse(this.loadedTestResponse[i].didTest) >= Date.parse(this.date)))
            this.filteredResponses.push(this.loadedTestResponse[i])
        }

      }

  }
}
</script>

<style scoped>

</style>
