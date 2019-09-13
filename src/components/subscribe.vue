<template>
  <div id="subscribe">   

      <form @submit.prevent="post">
          <input type="text" placeholder="Topic" id="Topic" name="Topic" readonly :value="Topic">
          <input type="text" placeholder="Address" id="Address" v-model="Address" name="Address">
          <input type="text" placeholder="Channel" id="Channel" v-model="Channel" name="Channel">
          
          <transition name="alert-in" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
            <!-- <p class="alert" v-if="errors.has('Topic')">{{ errors.first('Topic')}}</p> -->
          </transition>
          <button @click.prevent="post">subscribe</button>
      </form>

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
        Address:"",
        Channel:"",
    };
  },
  methods:{
      post(){
        axios.post('http://localhost:7071/api/subscribe', {
            Topic: this.Topic,
            Address: this.Address,
            Channel:this.Channel

        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        }); 
      },

  },
  mounted: function (){
    console.log(this.props)
    this.$nextTick(function () {
    })       
  }
}
</script>

<style scoped>
@import "https://use.fontawesome.com/releases/v5.0.6/css/all.css";
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

#subscribe{

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
    overflow: hidden;
}
 input {
    display: block;
    border: 0;
    font-size: 12px;
    padding: 10px;
    background-color: #323333;
    color: #fff;
    width:100%;
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

</style>
