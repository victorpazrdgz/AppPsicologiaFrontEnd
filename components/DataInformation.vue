<template>
  <div class="container">
    <h1 style="padding-top:1%;color: darkgreen; font-size: xx-large;text-align: center">{{'Data Information' }}</h1>

    <div class="columns" style="padding-top: 2%">
      <div class="column">
        <div class="field">
          <label class="label">Filter By: TestName</label>
          <div class="control select is-rounded"style="width: 100%">
            <select  v-model="testName" @change="callTestsName" style="width: 100%;border-color: orangered">
              <option class="label" disabled value="">Choose an Option</option>
              <option v-for=" testName in testsname" v-bind:value="testName">
                {{ testName.testName }}
              </option>

            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="table__wrapper" style=": overflow-x: auto;overflow-y: auto; max-height:100%;padding-top: 2%">
      <table class="table is-hoverable  is-fullwidth">
        <thead>
        <tr>
          <th>TestName</th>
          <th>UserName</th>
          <th>Response</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='(item,index) in this.loadedTestResponse'>
          <td>{{ item.testName }}</td>
          <td>{{ item.userName }}</td>
          <td>{{ item.responses }}</td>
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
    testsname:[],
  }),
  mounted:function (){
  this.callTestsResponse();

  },
  methods:{
    callTestsResponse(){
      let duplicate = false;
      this.$axios.$get('/responses').then( response => {
        this.loadedTestResponse = response;
       for(let i=0;i<this.loadedTestResponse.length;i++){
         duplicate = false;
         for(let j=0;j<this.testsname.length;j++){
           if(this.loadedTestResponse[i].testName == this.testsname[j].testName)
             duplicate=true;
         }
         if (duplicate == false) {
           this.testsname.push({testName:this.loadedTestResponse[i].testName});
         }
       }
        console.log("respuestas" +this.loadedTestResponse)
      })
    },
    callTestsName(){
      this.$axios.$get('/responses/testName',{
        params:{
          testName: this.testName.testName
        }
      }).then(response =>{
        console.log(response);
        this.loadedTestResponse = response;
      })
    }
  }
}
</script>

<style scoped>

</style>
