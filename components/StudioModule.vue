<template>
  <div class="container">
    <h1 style="padding-top:1%;color: darkgreen; font-size: xx-large;text-align: center">{{ 'Studio Module' }}</h1>
    <div class="divider" style="background: cornflowerblue"></div>
    <h2 style="padding-top: 5%" class="label">Create New Studio
      <button @click="newStudio()" class="button is-success is-rounded">New Studio</button>
    </h2>

    <div class="columns">
      <div class="column">
        <h2>Studios Created:</h2>
        <div class="table__wrapper" style=": overflow-x: auto;overflow-y: auto; max-height:350px">
          <table class="table is-hoverable  is-fullwidth">
            <tbody>
            <tr v-for='(item,index) in this.loadedStudios'>
              <td class="has-text-info is-size-4">{{ item.studioName }}</td>
              <td>
                <button @click="editStudio(item)" class="button is-primary is-rounded">Edit</button>
              </td>
              <td>
                <button @click="deleteStudio(item)" class="button is-danger is-rounded">Delete</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

      <modaltemplate v-if="isCreateStudio" :is="isCreateStudio" ref="my-modal" @save="saveModal" @close="exitModal">


        <h2 slot="header" style="color: midnightblue; font-size:120%; text-align: center;padding-left: 2%"><img
          class="AppLogo" style="padding-top:2%; text-align: center; width: 10%;height: 10%"
          src="~/assets/images/logo_uned.gif"><span style=";padding-left: 2%">  Create Question</span></h2>

        <div slot="body">
          <div class="field">
            <label class="label">Studio Name</label>
            <div class="control">
              <input type="text" id="capture-title" class="input is-rounded is-focused" placeholder="Name"
                     v-model="studioName" style="width: 100%"/>
            </div>
          </div>
          <div class="field">
            <label class="label">Studio Description</label>
            <div class="control">
            <textarea type="text" class="textarea has-fixed-size" placeholder="Description"
                      v-model="studioDescription" style="width: 100%"/>
            </div>
          </div>
          <div class="field" style="overflow-y: auto">
            <label class="label">Test For Studio</label>
            <div class="control " v-for="test in this.loadedTests">
              <input type="checkbox" v-if="test.isSelected == false"  v-model="test.isSelected"/>
              <input type="checkbox" v-if="test.isSelected == true" checked v-model="test.isSelected"/>
              {{ test.testName }}

            </div>
          </div>

        </div>
        <div slot="footer"></div>

      </modaltemplate>
    </div>
</template>

<script>
export default {
  name: "StudioModule",
  data: () => ({
    isCreateStudio: false,
    studioName: '',
    studioDescription: '',
    loadedStudios: [],
    tests: [],
    test:null,
    loadedTests: [],
    isSelected: false,
    isEditStudio:false,
    studioId:null,

  }),
  methods: {
    newStudio() {
      this.isCreateStudio = true;
      this.tests = [];
      for (var i = 0; i < this.loadedTests.length; i++) {
        // this.isSelected=false
        this.loadedTests[i]['isSelected'] = false;
      }
      this.studioName = '';
      this.studioDescription = '';
      this.isCreateStudio = () => import("../components/ModalForm");

    },
    saveModal() {

      for (var i = 0; i < this.loadedTests.length; i++) {
        if (this.loadedTests[i].isSelected == true)
          this.tests.push(this.loadedTests[i])
      }
      if(this.isEditStudio == false){
      this.$axios.post('/studio/new', {
        studioName: this.studioName,
        studioDescription: this.studioDescription,
        studioTests: this.tests,
      })
      } else{
        this.$axios.post('/studio/update', {
          id:this.studioId,
          studioName: this.studioName,
          studioDescription: this.studioDescription,
          studioTests: this.tests,
        }).then(response => {
          if(response.data == true)
            this.callStudios()
            this.tests = []
        })
      }
      this.isCreateStudio = false;
      this.isEditStudio =false;
    },
    exitModal() {
      this.isCreateStudio = false;
    },
    async callTest() {
      this.$axios.get("/tests").then(response => {
        this.loadedTests = response.data;

      })
    },
    async callStudios() {
      this.$axios.get("/studios").then(response => {
        this.loadedStudios = response.data;
      })
    },
    editStudio(item) {
      this.studioId = item.id;
      this.isCreateStudio = true;
      this.isEditStudio=true;

      for (var i = 0; i < this.loadedTests.length; i++) {
        // this.isSelected=false
         this.loadedTests[i]['isSelected'] = false;
      }
      console.log("chechdfa"+ this.loadedTests)

      for (var i = 0; i < this.loadedTests.length; i++) {
        for (var j = 0; j < item.studioTests.length; j++)
          if (this.loadedTests[i].testName == item.studioTests[j].testName) {
            this.loadedTests[i].isSelected=true


          }
      }

      this.studioName = item.studioName;
      this.studioDescription = item.studioDescription;
      this.isCreateStudio = () => import("../components/ModalForm");
    },
    deleteStudio() {
    }
  },
  mounted: function () {
    this.callStudios()
    this.callTest();
  },

}
</script>

<style scoped>

</style>
