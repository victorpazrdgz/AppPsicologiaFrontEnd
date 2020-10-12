<template>
  <div class="container">
    <h1 style="padding-top:1%;color: darkgreen; font-size: xx-large;text-align: center">{{ 'Users Module' }}</h1>

    <div class="table__wrapper" style=": overflow-x: auto;overflow-y: auto; max-height:100%;padding-top: 2%">
      <table class="table is-hoverable  is-fullwidth">
        <thead>
        <tr>
          <th>UserName</th>
          <th>E-mail</th>
          <th>Rol</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for='(item,index) in this.loadedUsers'>
          <td>{{ item.userName }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.role }}</td>
          <td>
            <button @click="editUser(item)" class="button  is-rounded is-success">Edit</button>
          </td>
          <td>
            <button @click="resetPass(item) " class="button  is-rounded is-warning">Reset Password</button>
          </td>
          <td>
            <button @click="deleteUser(item) " class="button  is-rounded is-danger">Delete</button>
          </td>

        </tr>

        </tbody>
      </table>
    </div>
    <modaltemplate v-if="isFormUser" :is="isFormUser" ref="my-modal" @save="saveModal" @close="exitModal">


      <h2 slot="header" style="color: midnightblue; font-size:120%; text-align: center;padding-left: 2%">  <img class="AppLogo"  style="padding-top:2%; text-align: center; width: 10%;height: 10%"  src="~/assets/images/logo_uned.gif"><span style=";padding-left: 2%">  Edit User</span></h2>

      <div slot="body">
        <form>
          <div class="columns" style="padding-top: 2%">

            <div class="column">
              <div class="field">
                <label class="label">UserName</label>
                <div class="control " style="width: 100%">
                  <input type="text" class="input is-rounded is-focused" placeholder="Username"
                         v-model="userName" style="width: 100%"/>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">E-mail</label>
                <div class="control " style="width: 100%">
                  <input type="email" class="input is-rounded" style="border-color: orangered" v-model="email" required/>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="field">
                <label class="label">Rol</label>
                <div class="control select is-rounded" style="width: 100%">
                  <select v-model="rol"   style="width: 100%;border-color: orangered">
                    <option class="label" value="USER">User</option>
                    <option class="label" value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
          <div class="columns" style="padding-top: 2%">

            <div class="column">
              <div class="field">
                <label class="label">Assigned Studios</label>
                <div class="control "  v-for="studio in this.loadedStudios" style="width: 100%" >
                  <input type="checkbox" v-if="studio.isSelected == false"  v-model="studio.isSelected"/>
                  <input type="checkbox" v-if="studio.isSelected == true" checked v-model="studio.isSelected"/>
                  {{ studio.studioName }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div slot="footer"></div>
    </modaltemplate>
  </div>
</template>

<script>
export default {
  name: "UsersModule",
  data: () => ({
    loadedUsers: [],
    id:'',
    userName: '',
    email: '',
    rol: '',
    password:'',
    isFormUser:false,
    loadedStudios: [],
    studios:[]
  }),
  mounted: function () {
    this.callUsers()
    this.callStudios()
  },
  methods: {
    async callUsers() {
      this.$axios.get("/users").then(response => {
        this.loadedUsers = response.data;
      })
    },
    editUser(item) {
      this.id = item.id;
      this.userName = item.userName;
      this.email = item.email;
      this.rol = item.role;
      this.password = item.password;

      for (var i = 0; i < this.loadedStudios.length; i++) {
        // this.isSelected=false
        this.loadedStudios[i]['isSelected'] = false;
      }

      for (var i = 0; i < this.loadedStudios.length; i++) {
        for (var j = 0; j < item.assignedStudios.length; j++)
          if (this.loadedStudios[i].studioName == item. assignedStudios[j].studioName) {
            this.loadedStudios[i].isSelected=true


          }
      }

      this.isFormUser = true;
      this.isFormUser =  () => import("../components/ModalForm");
    },
    resetPass(item){
      try {
        this.$axios.get('/resetPassword', {
          params: {
            userName: item.userName
          }
        }).then(response => {
          if (response.data == true)
            this.callUsers();
        });
      } catch (e) {
        this.error = e.response.data.message;
      }
    },
    deleteUser(item) {
      console.log("id delete" + item.id)
      try {
        this.$axios.delete('/user/delete', {
          data: {
            id: item.id
          }
        }).then(response => {
          if (response.data == true)
            this.callUsers();
        });
      } catch (e) {
        this.error = e.response.data.message;
      }
    },
    saveModal(){
      for (var i = 0; i < this.loadedStudios.length; i++) {
        if (this.loadedStudios[i].isSelected == true)
          this.studios.push(this.loadedStudios[i])
      }
      this.$axios.put('/user/update', {
        id:this.id,
        userName:this.userName,
        email:this.email,
        role:this.rol,
        password:this.password,
        assignedStudios:this.studios,
      }).then(response =>{
        if (response.data!=null){
          this.isFormUser = false;
          this.callUsers();
          this.callStudios();
        }
      })

    },
    exitModal(){
      this.isFormUser = false;
    },
    async callStudios() {
      this.$axios.get("/studios").then(response => {
        this.loadedStudios = response.data;
      })
    },

  }

}
</script>

<style scoped>

</style>
