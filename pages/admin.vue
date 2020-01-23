<template>
  <section class="section">
    <div class="container">
      <p>Hola admin </p>
      <h2>Dynamically inserted:</h2>

      <button @click="newTest">New Test</button>
      <modaltemplate v-if="isModalVisible" :is="isModalVisible" ref="my-modal" @save="saveModal" @close="exitModal">
        <h2 slot="header" style="text-align: center">Create Question</h2>
        <div slot="body">
          <div class="field">
            <label class="label">Question</label>
            <div class="control">
              <input type="text" id="capture-title" placeholder="Question" v-model="question" style="width: 100%"/>
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
              <input type="number" v-model="numberOptions" :min="2" :max="10" inline controls />
            </div>
            <label class="label">Question Options</label>
            <div class="control" v-for='(n,index) in this.numberOptionsRender'>
              {{ n }}
              <input type="text" v-model="questionOptions[n]" >
            </div>
          </div>


        </div>
        <div slot="footer"></div>

      </modaltemplate>
    </div>
  </section>
</template>

<script>
    import ModalForm from "../components/ModalForm";
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import { store } from '../store/user'
    export default {
      // middleware: 'auth-admin',
        // auth:{roles:{only:{"admin":user.role}}},
        // computed: {
        //     ...mapGetters(['loggedInUser','user']),
        //    user(){
        //        return store.state.user;
        //    },

        // },
        name: "admin",
        components: {ModalForm},
        data: () => ({
            isModalVisible : null,
            question:null,
            typeQuestion:null,
            numberOptions: 2,
            numberOptionsRender:2,
            questionOptions:[],
        }),

       methods: {
           async newTest() {
               this.isModalVisible = () => import("../components/ModalForm");
           },
           saveModal(){
               console.log(this.question);
               console.log(this.typeQuestion);
               this.isModalVisible = false;
           },
           exitModal() {

                   this.isModalVisible= false

           },
           forceRerender() {
               if (this.numberOptions>this.numberOptionsRender)
                this.numberOptionsRender++;
               else
                   this.numberOptionsRender--;
               this.$forceUpdate();
           }

       }

    }
</script>

<style scoped>

</style>
