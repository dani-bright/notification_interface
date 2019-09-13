<template>
  <div>
    <input type="date" @change="" id="date" :value="date"> 
    <div id="mainContainer"> 
      <userList/> 
      <transition name="form" enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
        <div class="form subscribe" v-show="subscribeForm">
            <div class="close"><i  v-on:click="subscribeForm=false" class="fa fa-close"></i></div>
          <subscribe :Topic="topicPath"/>
        </div>
      </transition>
      <transition name="form2" enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
        <div class="form subscribe" v-show="unsubscribeForm">
          <div class="close"><i  v-on:click="unsubscribeForm=false" class="fa fa-close"></i></div>
          <unsubscribe :Topic="topicPath"/>
        </div>
      </transition>

      <div v-show="topicPath!='' && topicPath.indexOf('/')!=-1" class="menu">
        <vue-context ref="menu">
          <ul>
              <li v-on:click="subscribeForm = !subscribeForm"><i class="fa fa-plus-circle"></i> subscribe</li>
              <li v-on:click="unsubscribeForm = !unsubscribeForm"><i class="fa fa-minus-circle"></i> unsubscribe</li>
          </ul>
      </vue-context>
      </div>
      
      <div class="holder" @contextmenu.prevent="$refs.menu.open">
        <div class="loader" v-show="loader">
                  <img id="gif" src="../loader2.gif" alt="">
                  <p id="loaderTxt">building tree</p>
                  <div id="progressBarContainer">
                    <div id="progressBar"></div>
                  </div>
        </div>
          <json-view v-show="!loader"
              :data="topics"
              rootKey="Notifications"
              valueKey="propriété"
              :maxDepth="1"
              :styles="{ key: '#43ACD9', valueKey:'#43ACD9' }"
              v-on:selected="LoadAllDataForTopic"
          />  
      </div>
    
      <transition name="list" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutLeft">
          <div class="messageHolder"  v-show="showMessage">
            <h4>{{topicPath}}</h4>
            <p id="noInfo" style="display:none">no Infos for this topic at this date</p> 
            <div class="message" v-for="(data,index) in MessagesToDisplay" :key='index'>
              <p class="title">{{data.Title}}</p>
              <p v-html="data.NotificationContents[0].Content"></p>
              <p>From : {{data.Sender}}</p>
              <p>{{data.SentAtUtc}}</p>
            </div>
          </div>
      </transition>
    </div>
  </div>
  
   
</template>
<script>
import { VueContext } from 'vue-context';
import {JSONView} from "vue-json-component";
import { store } from '../store/store'
import userList from './userList.vue'
import subscribe from './subscribe.vue'
import unsubscribe from './unsubscribe.vue'
//import Data from './data.json'
const axios = require('axios');

export default { 
  name: 'app',
  components: {
       "json-view": JSONView,
       VueContext,
       userList,
       subscribe,
       unsubscribe
  },
  data() {
    return {
      store,
      loader:true,
        topics:{},
        allMessages: [],
        allMessagesForTopic:[],
        showMessage:false,
        subscribeForm:false,
        unsubscribeForm:false,
        MessagesToDisplay: [{
            "SentAtUtc": "2019-05-13T16:02:41.9082826Z",
            "Topic": "Batches/aggregates",
            "Title": "Batch aggregates job is running (16:02:41 UTC)",
            "NotificationLevel": 1,
            "Sender": "BatchLauncher",
            "NotificationContents": [{
                "Content": "Info: Batch *aggregates*\nStarted At 2019/05/13 16:00 (UTC)\njob is running (16:02:41 UTC)\nCloudPoolState: Active, CloudJobState: Active, IsCompleted: False, ActiveTasksCount: 149, RunningTasksCount: 0, CompletedTasksCount: 0, FailedTasksCount: 0, SucceededTasksCount: 0",
                "ContentType": 2
            }]
        }],
        topicPath:"",
        date:'2019/07/01'
    };
  },
  methods: {
    async LoadAllDataForTopic(topic) {
      var path = topic.path.split(".").join("/");
      path = path.substring(14);      
      path = path.substring(0,path.length-6);
      this.topicPath = path;
      document.getElementById("gif").style.display="none";
      this.allMessages= [];
      var date= document.getElementById("date").value;
      this.date=date;
      document.getElementById("progressBarContainer").style.width=topic.length+"px";

      //avoir acces a tout les message d'un noeud sans avoir à tout déplier
      //si on enleve le slash le code effectuera les requetes sur tout les comptes au clic sur account (c'est long)
      if(path.includes("account/") || path.includes("error") || path.includes("infrastucture") ){
        store.getters.allTopics.forEach(item=>{
          if(item.includes(path)){
            axios.get('http://localhost:7071/api/messages?Topic='+item+'&Date='+this.date)
            .then(response => {
              if(response.request.status==200){
                  this.allMessages= [response.data, ...this.allMessages]
                  this.ViewMessageFromTopic(path);// est appelé plusieur fois, réfléchir à une autre manière de faire
              }
            }).catch(error => console.log(error)) 
          }
        })
      }
      else{
        axios.get('http://localhost:7071/api/messages?Topic='+path+'&Date='+this.date)
        .then(response => {
          if(response.request.status==200){
              this.allMessages= [response.data, ...this.allMessages]
              this.ViewMessageFromTopic(path);
          }
        }).catch(error => console.log(error)) 
      }   
    },
    getAllTopics: function(array) {
      this.store.commit('getAllTopics', array)
    },
    ViewMessageFromTopic(path) {
      this.MessagesToDisplay=[];
      var matchFound=0;
      this.showMessage = true;
      this.allMessages.forEach(array => {
        if(array.length>0){
          array.forEach(item=>{            
            var regex = new RegExp(path, 'gi');
            if (item.Topic.match(regex)) {
              matchFound++;
              document.getElementById("noInfo").style.display="none";
              this.MessagesToDisplay= [item, ...this.MessagesToDisplay]
            }
          })
        }
        else{
          if(matchFound==0){
            this.MessagesToDisplay=[];
            this.topicPath = path; 
            document.getElementById("noInfo").style.display="block";
          }
        }
      })
    },
  },
  mounted: async function () {    
    var today = new Date();
    var currentDate = '0'+(today.getDate());
    var currentMonth = '0'+(today.getMonth()+1);
    this.date = today.getFullYear()+'-'+currentMonth.slice(-2)+'-'+currentDate.slice(-2);

     var tree = await [];
     if(store.getters.allTopics.length==0){
        await axios.get('http://localhost:7071/api/topics')
        .then(response => {
            tree = response
            this.loader=false
        }).catch(error => document.getElementById("loaderTxt").innerHTML=error+ " cannot connect to API")

      var allTopics= await []
        await tree.data.forEach(item=>{
          allTopics.push(item.substring(9))
        })
        function groupBy(array){
          var Tab= [];
          array.forEach(item=>{
            if(Tab.indexOf(item)==-1 ){
              Tab.push(item)
            }
          })  
          return Tab;
        }
        this.getAllTopics(groupBy(allTopics)); 
     }
     else{
       this.loader=false;
     }
           
      //build the tree
      const start = {};
      function set(parts, mainMap) {
        for (const click of parts) {
          mainMap[click] = mainMap[click] || {click};
          mainMap = mainMap[click];
        }
      }
      await store.getters.allTopics.map(item => item.split('/')).forEach(parts => {
        set(parts, start);
      });
      this.topics = start;
  }
}
</script>

<style >
@import "https://use.fontawesome.com/releases/v5.0.6/css/all.css";
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

#mainContainer {
  display: flex;
  justify-content: center;
  height: 468px;
}

a {
  color: #43ACD9;
}

#mainContainer>* {
  width: 50%;
}

#mainContainer .menu {
  width: 200px;
  position: absolute;
}

.menu li {
  cursor: pointer;
}
.close{
  background: #444;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  bottom: 257px;
  color: #fff;
}

.holder {
  background: #fff;
  padding-top: 10px;
  overflow-x: hidden;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.13);
}

#progressBarContainer {
  height: 25px;
  width: 292px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid #eee;
}

#progressBar {
  background: #43ACD9;
  height: 100%;
  width: 0;
}

.loader {
  text-align: center;
  display: block;
  margin: 0 auto;
}

.loader p {
  padding: 0;
}

.messageHolder {
  text-align: center;
  color: #444;
  background: #FFF;
  padding: 6px;
  overflow-x: hidden;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.13);

  border-left: 5px solid #444;
}

.messageHolder p {
  font-size: 14px;
  padding: 5px;
  margin: 0;
  text-align: left;
}

.messageHolder p.title {
  font-weight: 700;
  text-transform: uppercase;
  color: #444;
}

.form {
  position: absolute;
  width: 500px !important;
  cursor: pointer;
  top: 420px;
  left: 510px;
  text-align: center;
}

.message {
  margin-bottom: 15px;
  border-bottom: 1px solid #444;
}

h4 {
  text-align: center;
  text-transform: uppercase;
  font-size: 18px;
  color:#EB6262;
}

h2 {
  text-align: center;
  text-transform: uppercase;
}


p {
  padding: 30px 0;
  color: gray;
}

p.topic {
  padding: 0;
  display: inline;
  cursor: pointer;
}

input[type=date] {
  width: 200px;
  background: #fff;
  display: block;
  margin: 0 auto;
  border: 4px solid #43ACD9;
  border-bottom: none;
  color: #687F7F;

}


</style>
