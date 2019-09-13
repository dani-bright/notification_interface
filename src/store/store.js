import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        allTopics: [],
        accountsDailyMessages:[]
    },
    mutations: {
        getAllTopics(state, allTopics) {
          state.allTopics = allTopics
        },
        getMessages(state, accountsDailyMessages) {
            state.accountsDailyMessages = accountsDailyMessages
        }
    },
    getters: {
        allTopics: state => state.allTopics,
        accountsDailyMessages: state => state.accountsDailyMessages
    }
})