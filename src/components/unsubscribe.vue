<template>
  <div id="unsubscribe">   

    <transition name="form" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
      <form @submit.prevent="connect">
          <input type="text" placeholder="topic" id="topic" name="topic" readonly :value="Topic">
          <input type="text" placeholder="user" id="user" v-model="user" name="user">
          
          <transition name="alert-in" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
            <!-- <p class="alert" v-if="errors.has('topic')">{{ errors.first('topic')}}</p> -->
          </transition>
          <button @click.prevent="connect">Unsubscribe</button>
      </form>
    </transition>

  </div>
   
</template>
<script>

const axios = require('axios');
export default { 
  name: 'app',
  components: {

  },
  props:{
    Topic:""
  },
  data() {
    return {
        showList:false,
        showForm:false,
        Title:"",
        topic:"",
        user:"",
    };
  },
  methods:{
      connect(){
        console.log("connecté");
        //valider le formulaire à l'ai de vee validate (directive = v-validate)
        this.$validator.validateAll().then((result)=>{
        
        }); 
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

<style>


</style>
