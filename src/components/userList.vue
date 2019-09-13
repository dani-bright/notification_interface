<template>
  <div id="userListContainer">   
   
    <transition  name="list-in" enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
        <div class="list" v-show="showList">
            <li v-for="(data,index) in list" :key='index'>
                <i class="fa fa-plus-circle fa-1x"></i>
                <i class="fa fa-minus-circle fa-1x"></i>
                {{data}}
            </li>
        </div>
    </transition>

    <transition  name="anotherList-in" enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutLeft">
        <div class="login" v-show="showList">
            <li v-on:click="showForm = !showForm">
                <i class="fa fa-sign-in fa-1x"></i>
                login
            </li>
            <li v-on:click="disconnect">
                <i class="fa fa-sign-out fa-1x"></i>
                logout
            </li>
        </div>
    </transition>

    <transition name="form" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
      <form @submit.prevent="connect" v-show="showForm">
          <input type="text" placeholder="username" id="username" v-model="Username" name="username">
          <input type="text" placeholder="password" id="password" v-model="Password" name="password">
          
          <transition name="alert-in" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
            <!-- <p class="alert" v-if="errors.has('Username')">{{ errors.first('Username')}}</p> -->
          </transition>
          <button @click.prevent="connect">Log in</button>
      </form>
    </transition>

    <i class="fa fa-user-circle fa-2x" v-on:click="showList = !showList"></i>

  </div>
   
</template>
<script>


export default { 
  name: 'app',
  components: {

  },
  data() {
    return {
        showList:false,
        showForm:false,
        Title:"",
        Username:"",
        Password:"",
        list:[
            "Batches/aggregates",
            "Alert/comptes",
            "Alert/comptes/gifi",
            "Alert/comptes/carrefour",
            "Alert/scénario/carrefour",
            "Alert/conversion/carrefour"
        ],
    };
  },
  methods:{
      connect(){
        console.log("connecté");
        //valider le formulaire à l'ai de vee validate (directive = v-validate)
      },
      disconnect(){
        console.log("déconnecté");

      },

  },
  mounted: function (){
    this.$nextTick(function () {
    })       
  }
}
</script>

<style >
@import "https://use.fontawesome.com/releases/v5.0.6/css/all.css";
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

#userListContainer{
  position: absolute;
  width:500px !important;
  cursor: pointer;
  overflow: hidden;
  z-index: 1;
  left:50%;
  transform: translateX(-50%); 
  bottom: 10px;
  text-align: center;
}
.list{
    width: 100%;
    margin: 0 auto;
    position: relative
}
.login{
    width: 140px;
    margin: 0 auto;
    position: relative;
    right: -170px;
    bottom: -30px;
}
form{
      position: absolute;
    bottom: 100px;
    width: 250px;
    right: 0;
}
 input {
    display: block;
    border: 0;
    padding: 15px;
    font-size: 1.3em;
    background-color: #323333;
    color: #687F7F;
  }
button{
  width:100%;
  background: #43ACD9;
  border:none;
  color: #fff;
  text-transform: uppercase;
  padding: 20px;
}
.alert{
    background-color: yellow;
    font-weight: bold;
    display: inline-block;
    padding: 5px;
    margin-top: -20px;
  }
i{
    margin: 0 4px;
}

 .anotherList-in-enter-active{
    left:300px;
  }

  
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  
  li {
    padding: 10px;
    font-size: 15px;
    background-color: #E0EDF4;
    margin-bottom: 2px;
    list-style: none;
    color: #3E5252;
  }


  p {
    text-align:center;
    padding: 30px 0;
    color: gray;
  }

</style>
