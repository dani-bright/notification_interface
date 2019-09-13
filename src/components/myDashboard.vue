<template>
  <div>
    <input type="date" @change="changeDate" id="date" :value="date"> 
    <div id="mainContainer">
      <div class="holder">
        <div class="loader" v-show="loader">
                  <img id="gif" src="../loader2.gif" alt="">
                  <p id="loaderTxt">building tree</p>
                  <div id="progressBarContainer">
                    <div id="progressBar"></div>
                  </div>
        </div>
          <li v-for="(data,index) in builder" :key='index' v-show="showAccounts">
            {{data.account}}
            <div class="tool">
                <div class="alertNumber">{{data.nbAlert+data.nbInfo}}</div>
                <button v-on:click="ViewMessageFromTopic" :data-topic="data.account" v-show="(data.nbAlert+data.nbInfo)>0">voir</button>
            </div>
            </li>
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
const axios = require('axios');

export default { 
  name: 'app',
  components: {
       "json-view": JSONView,
       
  },
  data() {
    return {
      store,
      loader:true,
      showAccounts:false,
        topics:[],
        accounts:[],
        showMessage:false,
        //consulter cette url http://localhost:7071/api/messages?Topic=Batches/aggregates&Date=2019/7/1
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
        date:'2019/07/01',
        builder:[],
        changeDay:false,
    };
  },
  methods: {
    async LoadAllData(array) {
        if (store.getters.accountsDailyMessages.length == 0 || this.changeDay == true) {
            document.getElementById("gif").style.display = "none";
            var requestDone = 0;
            this.showAccounts = false;
            this.loader = true;
            var date = document.getElementById("date").value;
            if (date != "") {
                this.date = date;
            }
            document.getElementById("progressBarContainer").style.width = array.length + "px";
            let promiseArray = []
            var getAllMessages = (item) => {
                return new Promise((resolve, reject) => {
                    axios.get('http://localhost:7071/api/messages?Topic=' + item + '&Date=' + this.date)
                    .then(response => {
                        if (response.request.status == 200) {
                            requestDone++;
                            document.getElementById("progressBar").style.width = requestDone + "px";
                            document.getElementById("loaderTxt").innerHTML = "Retrieving messages from topics ";
                            if (requestDone == array.length) {
                                this.loader = false;
                            }
                            return resolve(response.data)
                        }
                    }).catch(error => {
                        return reject(error.messages)
                    })
                })
            }
            array.forEach((item) => {
                promiseArray.push(getAllMessages(item))
            })

            await Promise.all(promiseArray).then(values => {
                this.getMessages(values)
            });
            //console.log(accountsDailyMessages);//c'est censé attendre que tout les requête soit lancé
            this.changeDay = false;
        } 
        this.builder.forEach(account => {
            //remettre le compte à 0 a chaque fois
            account.nbAlert = 0
            account.nbInfo = 0
            store.getters.accountsDailyMessages.forEach(array => {
                let nbAlert = array.length
                array.forEach(async (item) => {
                    var regex = new RegExp(account.account, 'gi');
                    if (item.Topic.match(regex)) {
                        //chaque compte à deux requêtes donc 2 array d'alertes il faudra addtioner la longueur des tableau
                        //pour avoir le nb total d'alerte pour un compte (à optimiser une fois les topics revu)                        
                        if (item.Topic.includes("Alert")) {
                            account.nbAlert = array.length
                        } else {
                            account.nbInfo = array.length
                        }
                    }
                })
            })
        })
        this.showAccounts = true;
    },
    changeDate: function(array) {
        this.changeDay=true;
        this.LoadAllData(this.topics);
    },
    getMessages: function(array) {
        this.store.commit('getMessages', array)
    },
    getAllTopics: function(array) {
        this.store.commit('getAllTopics', array)
    },
    ViewMessageFromTopic(e) {
        var topic=e.target.getAttribute("data-topic");
        this.MessagesToDisplay=[];
        var matchFound=0;
        store.getters.accountsDailyMessages.forEach(array => {
            array.forEach(item => {
                var regex = new RegExp(topic, 'gi');
                if (item.Topic.match(regex)) {
                    matchFound++;
                    document.getElementById("noInfo").style.display = "none";
                    this.MessagesToDisplay = [item, ...this.MessagesToDisplay]
                    this.showMessage = true;
                } else if (matchFound == 0) {
                    this.MessagesToDisplay = [];
                    document.getElementById("noInfo").style.display = "block";
                }
            })
        })
    },
  },
  mounted: async function () {    
    var today = new Date();
    var currentDate = '0' + (today.getDate());
    var currentMonth = '0' + (today.getMonth() + 1);
    this.date = today.getFullYear() + '-' + currentMonth.slice(-2) + '-' + currentDate.slice(-2);

    function groupBy(array) {
        var Tab = [];
        array.forEach(item => {
            if (Tab.indexOf(item) == -1) {
                Tab.push(item)
            }
        })
        return Tab;
    }

    var tree = [];
    if (store.getters.allTopics.length == 0) {
        await axios.get('http://localhost:7071/api/topics')
        .then(response => {
            tree = response
            this.loader = false
        }).catch(error => document.getElementById("loaderTxt").innerHTML = error + " cannot connect to API")

        var allTopics = []
        tree.data.forEach(item => {
            allTopics.push(item.substring(9))
        })
        this.getAllTopics(groupBy(allTopics));
    } 
    else {
        this.loader = false;
    }

    store.getters.allTopics.forEach(item => {
        //on ne veut garder que les requetes sur les comptes
        //partie qui pourra etre obliger une fois les topics revu
        if (item.includes('account/') && (item.includes('monitoring/info') || item.includes('monitoring/alert'))) {
            this.topics = [item, ...this.topics];
            var account = item.substring(8, 44);
            this.accounts = [account, ...this.accounts];

        }
    })

    //il y'a des doublons
    this.accounts = groupBy(this.accounts)

    //on construit des objets pour pouvoir compter le nombre d'alertes par comptes
    this.accounts.forEach(account=>{
        //il y'a deux requêtes (requetes sur infos et sur Alert) il faudra additioner les 2
        this.builder.push({
            'account': account,
            'nbAlert': 0,
            'nbInfo':0
        })
    })
    this.LoadAllData(this.topics);    
  }
}
</script>

<style scoped>
@import "https://use.fontawesome.com/releases/v5.0.6/css/all.css";
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

#mainContainer {
  display: flex;
  justify-content: center;
  height: 468px;
}
li{
    position: relative;
    padding: 20px 5px;
}

a {
  color: #43ACD9;
}
.tool{
    position: absolute;
    right: 5px;
    bottom: 13px;
    display: flex;
}
.alertNumber{
    width: 25px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    border-radius: 50%;
    color: #fff;
    background: #43ACD9;
    margin-right:6px;
}
button{
      width: 52px;
    background: #43ACD9;
    border: none;
    color: #fff;
    text-transform: uppercase;
    padding: 7px;
    cursor: pointer;
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
