<template>
  <section class="section">
    <div class="container">
  <h1>User Page </h1>

  <div v-for='(item,index) in this.loadedTest'>
    <a @click="renderTest(item)" href="#">{{item.testName}} </a>
  </div>
 <render-test v-show="isRenderTest" v-bind:questions= this.questions  v-bind:testName=this.testname  v-bind:isRenderTest=this.isRenderTest @close-render ="updateRender"></render-test>
    </div>
  </section>
</template>

<script>
    import RenderTest from "../components/RenderTest";
    import Bus from '~/assets/bus'
    export default {
        name: "user",
        components: {RenderTest},
        data: () => ({
            loadedTest : [],
            isRenderTest:null,
            testname:null,
            questions:[],

        }),
        mounted() {
            this.$axios.get("/tests").then( response =>{
                this.loadedTest = response.data;
                console.log("data"+ this.loadedTest.length)
             for (var i=0;i<this.loadedTest.length;i++)
                console.log("hola"+this.loadedTest[i].testName)
           })
        },
       methods:{
            renderTest(item){
                console.log("entro render")
                this.isRenderTest =true;
                this.testname= item.testName
                this.questions=item.questions
            },
           updateRender( value){
                this.isRenderTest=value;
           }

       }
    }
</script>

<style scoped>

</style>
